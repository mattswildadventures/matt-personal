import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useContext, useRef, useState, useMemo, useCallback } from "react";
import { useClickAway, useKey } from "react-use";
import { ThemeUICSSObject } from "theme-ui";
import { GlobalContext } from "../../contexts/GlobalContext";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useMatchTheme from "../../hooks/useMatchTheme";
import useTaskbarHeight from "../../hooks/useTaskbarHeight";
import useDimensions from "../../hooks/useDimentions";
import { getRoute } from "../../misc/routes";
import { ThemeMode } from "../../themes";
import { zIndex } from "../../themes/common";
import { 
  getDefaultDockSpacingMode, 
  getDefaultDockSpacingExtended, 
  getDefaultDockSpacingCompact,
  getDefaultDockGapSize,
  getDefaultSocialDisplayMode,
  getDefaultShowSeparator
} from "../../utils/envDefaults";
import DockIcon from "../atoms/dock/DockIcon";
import ReactIcon from "../atoms/IconReact";
import PanelConfig from "../molecules/PanelConfig";

type MacDockProps = {
  welcomeActive?: boolean;
  isMusicExpanded?: boolean;
  isMusicPlaying?: boolean;
  onToggleMusic?: () => void;
  isGalleryExpanded?: boolean;
  onToggleGallery?: () => void;
};

export default function MacDock({ welcomeActive, isMusicExpanded, isMusicPlaying, onToggleMusic, isGalleryExpanded, onToggleGallery }: MacDockProps) {
  const router = useRouter();
  const { hideTaskbar, showExtendedDockDesktop, showExtendedDockMobile, dockMagnification } = useContext(GlobalContext);
  const [isConfigActive, setIsConfigActive] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [configPanel, setConfigPanel] = useState(false);
  const [clickOrigin, setClickOrigin] = useState<{ x: number; y: number } | null>(null);
  const [isSocialPopupVisible, setIsSocialPopupVisible] = useState(false);
  const isMobile = useInBreakpoint(1); // Use 768px breakpoint for better mobile detection
  const { width: screenWidth } = useDimensions();
  
  
  const panelRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  
  const route = getRoute(router.asPath);
  const isHomePage = router.asPath === "/";
  
  // Dock spacing configuration from environment
  const dockSpacingMode = getDefaultDockSpacingMode();
  const dockSpacingExtended = getDefaultDockSpacingExtended();
  const dockSpacingCompact = getDefaultDockSpacingCompact();
  const dockGapSize = getDefaultDockGapSize();

  // Move hook calls outside conditional usage
  const isLiquidGlassTheme = useMatchTheme(ThemeMode.LiquidGlass);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);

  useClickAway(panelRef, (event) => {
    const isDockClick = dockRef.current?.contains(event.target as Node);
    if (!isDockClick) {
      setIsConfigActive(false);
      setIsSocialPopupVisible(false);
    }
  });

  useKey("Escape", () => {
    setIsConfigActive(false);
    setIsSocialPopupVisible(false);
  });

  // Calculate magnification based on hover (disabled on mobile or when magnification is off)
  const getMagnification = (index: number): number => {
    if (isMobile || !dockMagnification.val || hoveredIndex === null) return 1;

    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.33; // Primary hover: 64px (48px * 1.33)
    if (distance === 1) return 1.17; // Adjacent: 56px (48px * 1.17)
    if (distance === 2) return 1.08; // Second adjacent: 52px (48px * 1.08)
    return 1; // Default: 48px
  };

  // Get the appropriate extended dock setting based on current platform
  // Mobile never shows extended dock — navigation is handled by the welcome screen cards
  const getShowExtendedDock = useCallback((): boolean => {
    return isMobile ? false : showExtendedDockDesktop.val;
  }, [isMobile, showExtendedDockDesktop.val]);

  // Social display configuration from environment (pass extended dock state for smart fallback)
  const socialDisplayMode = getDefaultSocialDisplayMode(getShowExtendedDock());
  const showSeparator = getDefaultShowSeparator();

  // Calculate dock justification based on spacing configuration
  const getDockJustification = (): string => {
    if (!isMobile) {
      return 'center'; // Desktop always uses center alignment
    }

    // Mobile spacing logic based on configuration
    switch (dockSpacingMode) {
      case 'adaptive':
        // Smart mode: use different spacing based on extended dock state
        return getShowExtendedDock() ? dockSpacingExtended : dockSpacingCompact;
      
      case 'space-evenly':
      case 'center': 
      case 'space-between':
      case 'space-around':
        // Fixed spacing mode
        return dockSpacingMode;
      
      default:
        // Fallback to adaptive behavior
        return getShowExtendedDock() ? 'space-evenly' : 'center';
    }
  };

  // Import centralized taskbar height hook
  const taskbarHeight = useTaskbarHeight();

  // Dynamic sizing calculation for mobile taskbar - moved here before style objects
  const { iconSize, gapSize, needsScrolling } = useMemo(() => {
    if (!isMobile) {
      return { iconSize: 48, gapSize: 4, needsScrolling: false };
    }

    // Count total icons that will be rendered
    const coreNavigationCount = 1; // Home icon
    const extendedNavigationCount = getShowExtendedDock() ? 6 : 0; // Extended navigation icons based on platform
    
    // Calculate social icons count based on display mode and separator visibility
    let socialCount = 0;
    if (socialDisplayMode === 'popup') {
      socialCount = 1; // Just the share button
    } else {
      // Individual mode: 3 social icons + optional separator
      const shouldShowSeparator = getShowExtendedDock() && showSeparator;
      socialCount = shouldShowSeparator ? 4 : 3; // 3 icons + separator if conditions met
    }
    
    const musicCount = 1; // Music icon on mobile
    const galleryCount = 1; // Gallery icon on mobile
    const settingsCount = 1;
    const totalIcons = coreNavigationCount + extendedNavigationCount + socialCount + musicCount + galleryCount + settingsCount;

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
    
    // Check if we need horizontal scrolling
    const totalRequiredWidth = (totalIcons * optimalIconSize) + ((totalIcons - 1) * optimalGap);
    const needsScrolling = totalRequiredWidth > availableWidth;
    
    return {
      iconSize: optimalIconSize,
      gapSize: optimalGap,
      needsScrolling
    };
  }, [isMobile, screenWidth, getShowExtendedDock]);


  const dockStyle: ThemeUICSSObject = {
    position: "fixed",
    bottom: "16px",
    left: "0",
    right: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
    pointerEvents: "none", // Allow clicks to pass through the container
    zIndex: zIndex.taskbar,
    
    // Mobile responsive adjustment - full width taskbar
    ...(isMobile && {
      bottom: "0",
      justifyContent: "stretch", // Full width on mobile
    }),
  };

  const dockInnerStyle: ThemeUICSSObject = {
    display: "flex",
    alignItems: "end",
    gap: `${dockGapSize}px`,
    pointerEvents: "auto", // Re-enable pointer events for the actual dock
    padding: "8px",
    borderRadius: "20px",
    willChange: "transform",
    transform: "translate3d(0, 0, 0)", // Hardware acceleration
    overflow: "visible", // Allow magnified icons to extend past the dock bar

    // Theme-adaptive glassmorphism via dock tokens
    bg: "dockBg",
    backdropFilter: isCyberpunkTheme
      ? "blur(20px) saturate(1.2)"
      : isLiquidGlassTheme
        ? "blur(20px) saturate(1.8) brightness(1.1)"
        : "blur(20px)",
    border: "1px solid",
    borderColor: "dockBorder",
    boxShadow: isCyberpunkTheme
      ? (theme: any) => `0 0 20px ${theme.colors?.dockGlow}, 0 0 40px ${theme.colors?.dockShadow}, inset 0 0 20px ${theme.colors?.dockGlow}`
      : (theme: any) => `0 8px 32px ${theme.colors?.dockShadow}`,

    // Mobile taskbar styling - full width, no rounded corners
    ...(isMobile && {
      width: "100%",
      padding: "8px 12px",
      borderRadius: "0",
      gap: `${gapSize}px`,
      justifyContent: needsScrolling ? "flex-start" : getDockJustification(), // Use configured spacing
      border: isCyberpunkTheme ? "1px solid" : "none",
      borderColor: isCyberpunkTheme ? "dockBorder" : undefined,
      borderTop: "1px solid",
      borderTopColor: "dockBorder",
      boxShadow: isCyberpunkTheme
        ? (theme: any) => `0 0 20px ${theme.colors?.dockGlow}, 0 0 40px ${theme.colors?.dockShadow}, inset 0 0 20px ${theme.colors?.dockGlow}`
        : (theme: any) => `0 -4px 20px ${theme.colors?.dockShadow}`,
      minHeight: `${taskbarHeight}px`,
      height: `${taskbarHeight}px`,
      // Add horizontal scrolling when needed
      ...(needsScrolling && {
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
        "&::-webkit-scrollbar": {
          display: "none", // Chrome/Safari
        },
        // Enable smooth scrolling
        scrollBehavior: "smooth",
        // Prevent vertical movement
        touchAction: "pan-x",
      }),
    }),
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleIconHover = (index: number) => {
    setHoveredIndex(index);
  };

  const handleIconClick = (onClick: () => void, event: React.MouseEvent) => {
    // Store click origin for window animation
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    setClickOrigin(origin);
    
    // Store in sessionStorage for Layout component to access
    sessionStorage.setItem('windowOrigin', JSON.stringify(origin));
    
    // Execute the original click handler
    onClick();
  };

  // Custom home icon
  const HomeIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      sx={{ opacity: 0.8 }}
    >
      <path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1zM12 4.7L18 10.1V19h-2v-6H8v6H6v-8.9L12 4.7z"/>
    </svg>
  );

  // Share icon for mobile
  const ShareIcon = () => (
    <svg 
      stroke="currentColor" 
      fill="currentColor" 
      strokeWidth="0" 
      viewBox="0 0 1024 1024" 
      height="24" 
      width="24" 
      xmlns="http://www.w3.org/2000/svg"
      sx={{ opacity: 0.8 }}
    >
      <path d="M752 664c-28.5 0-54.8 10-75.4 26.7L469.4 540.8a160.68 160.68 0 0 0 0-57.6l207.2-149.9C697.2 350 723.5 360 752 360c66.2 0 120-53.8 120-120s-53.8-120-120-120-120 53.8-120 120c0 11.6 1.6 22.7 4.7 33.3L439.9 415.8C410.7 377.1 364.3 352 312 352c-88.4 0-160 71.6-160 160s71.6 160 160 160c52.3 0 98.7-25.1 127.9-63.8l196.8 142.5c-3.1 10.6-4.7 21.8-4.7 33.3 0 66.2 53.8 120 120 120s120-53.8 120-120-53.8-120-120-120zm0-476c28.7 0 52 23.3 52 52s-23.3 52-52 52-52-23.3-52-52 23.3-52 52-52zM312 600c-48.5 0-88-39.5-88-88s39.5-88 88-88 88 39.5 88 88-39.5 88-88 88zm440 236c-28.7 0-52-23.3-52-52s23.3-52 52-52 52 23.3 52 52-23.3 52-52 52z"/>
    </svg>
  );


  // Social popup component (mobile only - shows just the social icons)
  const SocialPopup = () => (
    <AnimatePresence>
      {isSocialPopupVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSocialPopupVisible(false)}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              zIndex: zIndex.taskbar - 1,
            }}
          />
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            sx={{
              position: "fixed",
              bottom: `${taskbarHeight + 16}px`, // Dynamic positioning based on taskbar height
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "8px",
              padding: "12px",
              borderRadius: "16px",
              bg: "dockBg",
              backdropFilter: isCyberpunkTheme
                ? "blur(20px) saturate(1.2)"
                : isLiquidGlassTheme
                  ? "blur(20px) saturate(1.8) brightness(1.1)"
                  : "blur(20px)",
              border: "1px solid",
              borderColor: "dockBorder",
              boxShadow: isCyberpunkTheme
                ? (theme: any) => `0 0 20px ${theme.colors?.dockGlow}, 0 0 40px ${theme.colors?.dockShadow}, inset 0 0 20px ${theme.colors?.dockGlow}`
                : (theme: any) => `0 8px 32px ${theme.colors?.dockShadow}`,
              zIndex: zIndex.taskbar,
            }}
          >
            {desktopSocialIcons.map((icon, index) => (
              <DockIcon
                key={`social-popup-${icon.label}-${index}`}
                iconName={icon.iconName}
                customIcon={icon.customIcon}
                label={icon.label}
                onClick={icon.onClick}
                href={icon.href}
                isActive={false}
                index={index}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                scale={1}
                isNavigationIcon={false}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Base navigation icons - split into core and extended
  const coreNavigationIcons = [
    {
      iconName: undefined,
      customIcon: <HomeIcon />,
      label: "Home",
      onClick: () => router.push("/"),
      href: undefined,
      isActive: isHomePage,
      isNavigationIcon: true,
    },
  ];

  const extendedNavigationIcons = [
    {
      iconName: undefined,
      customIcon: <ReactIcon iconName="PiUserFill" size={28} />,
      label: "About Me",
      onClick: () => router.push("/about"),
      href: undefined,
      isActive: router.asPath === "/about",
      isNavigationIcon: true,
    },
    {
      iconName: undefined,
      customIcon: <ReactIcon iconName="PiBriefcaseFill" size={28} />,
      label: "My Work",
      onClick: () => router.push("/work"),
      href: undefined,
      isActive: router.asPath === "/work",
      isNavigationIcon: true,
    },
    {
      iconName: undefined,
      customIcon: <ReactIcon iconName="PiWrenchFill" size={28} />,
      label: "Skills",
      onClick: () => router.push("/skills"),
      href: undefined,
      isActive: router.asPath === "/skills",
      isNavigationIcon: true,
    },
    {
      iconName: undefined,
      customIcon: <ReactIcon iconName="PiBookOpenFill" size={28} />,
      label: "Research Paper",
      onClick: () => router.push("/research-paper"),
      href: undefined,
      isActive: router.asPath === "/research-paper",
      isNavigationIcon: true,
    },
    {
      iconName: undefined,
      customIcon: <ReactIcon iconName="PiBrainFill" size={28} />,
      label: "My Mindset",
      onClick: () => router.push("/mindset"),
      href: undefined,
      isActive: router.asPath === "/mindset",
      isNavigationIcon: true,
    },
    {
      iconName: undefined,
      customIcon: <ReactIcon iconName="PiCompassFill" size={28} />,
      label: "Roadmap",
      onClick: () => router.push("/roadmap"),
      href: undefined,
      isActive: router.asPath === "/roadmap",
      isNavigationIcon: true,
    },
  ];

  // Combine navigation icons based on platform-specific toggle state
  const navigationIcons = [
    ...coreNavigationIcons,
    ...(getShowExtendedDock() ? extendedNavigationIcons : [])
  ];

  // Desktop social media icons
  const desktopSocialIcons = [
    // {
    //   iconName: undefined,
    //   customIcon: <ReactIcon iconName="SiGithub" size={28} />,
    //   label: "GitHub",
    //   onClick: undefined,
    //   href: "https://github.com/khang-nd",
    //   isActive: false,
    //   isNavigationIcon: false,
    // },
    {
      iconName: undefined,
      customIcon: <ReactIcon iconName="FaLinkedinIn" size={28} />,
      label: "LinkedIn", 
      onClick: undefined,
      href: "https://www.linkedin.com/in/matthew-day-a6230056/",
      isActive: false,
      isNavigationIcon: false,
    },
    {
      iconName: undefined,
      customIcon: <ReactIcon iconName="SiTwitter" size={28} />,
      label: "X",
      onClick: undefined,
      href: "https://x.com/mattstechadventures", 
      isActive: false,
      isNavigationIcon: false,
    },
    {
      iconName: undefined,
      customIcon: <ReactIcon iconName="FaInstagram" size={28} />,
      label: "Instagram",
      onClick: undefined,
      href: "http://instagram.com/mattstechadventures",
      isActive: false,
      isNavigationIcon: false,
    },
    // {
    //   iconName: undefined,
    //   customIcon: <ReactIcon iconName="SiFandom" size={28} />,
    //   label: "Fandom",
    //   onClick: undefined,
    //   href: "https://dev.fandom.com/wiki/User:KhangND",
    //   isActive: false,
    //   isNavigationIcon: false,
    // },
  ];

  // Music icon for mobile dock
  const MusicDockIcon = () => (
    <div sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" sx={{ opacity: 0.8 }}>
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
      {/* Playing indicator dot */}
      {isMusicPlaying && (
        <div
          sx={{
            position: "absolute",
            bottom: "-3px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            bg: "highlight",
            boxShadow: (theme: any) => {
              const c = theme.colors?.highlight || "#1abc9c";
              return `0 0 4px ${c}, 0 0 8px ${c}`;
            },
          }}
        />
      )}
    </div>
  );

  // Gallery icon for mobile dock
  const GalleryDockIcon = () => (
    <div sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" sx={{ opacity: 0.8 }}>
        <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM184,200H40V88H184Zm32-32H200V88a16,16,0,0,0-16-16H72V56H216ZM160,116a12,12,0,1,1-12-12A12,12,0,0,1,160,116Zm-16,52H56a8,8,0,0,1-6.65-12.44l24-36a8,8,0,0,1,13.3,0L98.42,137.1l18.24-27.37a8,8,0,0,1,13.34.34l24,40A8,8,0,0,1,147.15,160Z" />
      </svg>
    </div>
  );

  // Dock icons configuration (env-controlled social display)
  const dockIcons = [
    ...navigationIcons,

    // Social icons based on environment configuration
    ...(socialDisplayMode === 'popup' ? [
      // Popup mode: Single share icon with popup
      {
        iconName: undefined,
        customIcon: <ShareIcon />,
        label: "Share",
        onClick: () => setIsSocialPopupVisible(!isSocialPopupVisible),
        href: undefined,
        isActive: isSocialPopupVisible,
        isNavigationIcon: false,
      }
    ] : [
      // Individual mode: Conditional separator + individual social icons
      ...(getShowExtendedDock() && showSeparator ? [{
        iconName: undefined,
        customIcon: <div sx={{ width: "2px", height: "32px", bg: "dockBorder", borderRadius: "1px" }} aria-hidden="true" />,
        label: "Separator",
        onClick: () => {},
        href: undefined,
        isActive: false,
        isNavigationIcon: false,
      }] : []),
      ...desktopSocialIcons
    ]),

    // Music icon (mobile only)
    ...(isMobile && onToggleMusic ? [{
      iconName: undefined,
      customIcon: <MusicDockIcon />,
      label: "Music",
      onClick: onToggleMusic,
      href: undefined,
      isActive: !!isMusicExpanded,
      isNavigationIcon: false,
    }] : []),

    // Gallery icon (mobile only)
    ...(isMobile && onToggleGallery ? [{
      iconName: undefined,
      customIcon: <GalleryDockIcon />,
      label: "Gallery",
      onClick: onToggleGallery,
      href: undefined,
      isActive: !!isGalleryExpanded,
      isNavigationIcon: false,
    }] : []),

    // Settings (always present)
    {
      iconName: undefined,
      customIcon: <ReactIcon iconName="PiGearFill" size={28} />,
      label: "Settings",
      onClick: () => setIsConfigActive(!isConfigActive),
      href: undefined,
      isActive: isConfigActive,
      isNavigationIcon: false,
    },
  ];

  return (
    <>
      <nav sx={dockStyle} aria-label="Application dock">
        <motion.div
          ref={dockRef}
          sx={dockInnerStyle}
          onMouseLeave={handleMouseLeave}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: welcomeActive ? 100 : 0, opacity: welcomeActive ? 0 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: welcomeActive ? 0 : 0.1 }}
          role="menubar"
        >
          {dockIcons.map((icon, index) => (
            <DockIcon
              key={`${icon.label}-${index}`}
              iconName={icon.iconName}
              customIcon={icon.customIcon}
              label={icon.label}
              onClick={icon.isNavigationIcon && icon.onClick ? 
                (e) => handleIconClick(icon.onClick!, e) : 
                icon.onClick
              }
              href={icon.href}
              isActive={icon.isActive}
              index={index}
              onMouseEnter={handleIconHover}
              onMouseLeave={handleMouseLeave}
              scale={getMagnification(index)}
              isNavigationIcon={icon.isNavigationIcon}
              customSize={isMobile ? iconSize : undefined}
            />
          ))}
        </motion.div>
      </nav>

      <SocialPopup />

      {/* Backdrop overlay for mobile bottom sheet */}
      <AnimatePresence>
        {isMobile && isConfigActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsConfigActive(false)}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 99, // Just below the panel (100)
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <PanelConfig isVisible={isConfigActive} ref={panelRef} />
    </>
  );
}