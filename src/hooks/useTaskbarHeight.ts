import { useEffect, useState, useMemo, useContext, useCallback } from "react";
import { sizes } from "../themes";
import { GlobalContext } from "../contexts/GlobalContext";
import useInBreakpoint from "./useInBreakpoint";
import useIsLandscape from "./useIsLandscape";
import useDimensions from "./useDimentions";

export default function useTaskbarHeight() {
  const { showExtendedDockDesktop, showExtendedDockMobile } = useContext(GlobalContext);
  const isLandscape = useIsLandscape();
  const isMobile = useInBreakpoint(0, isLandscape);
  const isMobilePortrait = useInBreakpoint(1); // Use breakpoint 1 to match MacDock mobile detection
  const { width: screenWidth } = useDimensions();
  const [height, setHeight] = useState(sizes[8]);

  // Get the appropriate extended dock setting based on current platform (matching MacDock logic)
  const getShowExtendedDock = useCallback((): boolean => {
    return isMobilePortrait ? showExtendedDockMobile.val : showExtendedDockDesktop.val;
  }, [isMobilePortrait, showExtendedDockMobile.val, showExtendedDockDesktop.val]);

  // Calculate dynamic mobile taskbar height (same logic as MacDock)
  const calculatedMobileHeight = useMemo(() => {
    if (!isMobilePortrait) return 76; // Default mobile height

    // Count total icons that will be rendered (matching MacDock exactly)
    const coreNavigationCount = 1; // Home icon
    const extendedNavigationCount = getShowExtendedDock() ? 6 : 0; // Extended navigation icons based on platform
    const socialCount = 1; // Share icon on mobile
    const musicCount = 1; // Music icon on mobile
    const settingsCount = 1;
    const totalIcons = coreNavigationCount + extendedNavigationCount + socialCount + musicCount + settingsCount;

    // Available width calculation - account for iPhone safe area
    const taskbarPadding = 20; // Reduced padding for better fit
    const safeAreaInsets = 8; // Additional margin for iPhone safe areas
    const availableWidth = screenWidth - taskbarPadding - safeAreaInsets;
    
    // Calculate optimal icon size - more aggressive sizing
    const minIconSize = 24; // Further reduced minimum size
    const maxIconSize = 40; // Reduced max size to leave more room for gaps
    const minGap = 1; // Absolute minimum 1px gap as requested
    const maxGap = 8; // Reduced maximum gap
    
    // Try different icon sizes to find the best fit
    let optimalIconSize = minIconSize; // Start with minimum
    let optimalGap = minGap; // Start with minimum gap
    
    // Calculate what fits with guaranteed minimum gaps
    for (let iconSize = maxIconSize; iconSize >= minIconSize; iconSize -= 2) {
      const totalIconsWidth = totalIcons * iconSize;
      const requiredGapSpace = (totalIcons - 1) * minGap;
      const totalRequiredWidth = totalIconsWidth + requiredGapSpace;
      
      if (totalRequiredWidth <= availableWidth) {
        // This size fits! Calculate actual gap we can use
        const remainingWidth = availableWidth - totalIconsWidth;
        const calculatedGap = remainingWidth / (totalIcons - 1);
        
        optimalIconSize = iconSize;
        optimalGap = Math.min(maxGap, calculatedGap);
        break;
      }
    }
    
    // More aggressive fallback: if nothing fits with minimum gaps, force fit
    if (optimalIconSize === minIconSize && optimalGap === minGap) {
      const totalIconsWidth = totalIcons * minIconSize;
      const remainingWidth = Math.max(0, availableWidth - totalIconsWidth);
      optimalGap = Math.max(1, remainingWidth / (totalIcons - 1)); // At least 1px gap
      
      // If still doesn't fit, enable horizontal scrolling and use minimum values
      if (totalIconsWidth + (totalIcons - 1) * 1 > availableWidth) {
        // Force minimum icon size with 1px gaps - will enable scrolling
        optimalIconSize = Math.max(20, minIconSize); // Absolute minimum
        optimalGap = 1; // 1px as requested
      }
    }
    
    // Calculate taskbar height based on icon size
    const padding = 16; // 8px top + 8px bottom
    return optimalIconSize + padding;
  }, [isMobilePortrait, screenWidth, getShowExtendedDock]);

  useEffect(() => {
    if (isMobilePortrait) {
      setHeight(calculatedMobileHeight);
    } else {
      // Desktop dock height calculation
      setHeight(sizes[isMobile && isLandscape ? 7 : 8]);
    }
  }, [isLandscape, isMobile, isMobilePortrait, calculatedMobileHeight]);

  return height;
}
