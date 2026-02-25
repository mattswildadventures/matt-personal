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
import MusicPlayer from "../molecules/MusicPlayer";

type MacDockProps = {
  welcomeActive?: boolean;
};

export default function MacDock({ welcomeActive }: MacDockProps) {
  const router = useRouter();
  const { hideTaskbar, showExtendedDockDesktop, showExtendedDockMobile } = useContext(GlobalContext);
  const [isConfigActive, setIsConfigActive] = useState(false);
  const [isMusicActive, setIsMusicActive] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [configPanel, setConfigPanel] = useState(false);
  const [clickOrigin, setClickOrigin] = useState<{ x: number; y: number } | null>(null);
  const [isSocialPopupVisible, setIsSocialPopupVisible] = useState(false);
  const isMobile = useInBreakpoint(1); // Use 768px breakpoint for better mobile detection
  const { width: screenWidth } = useDimensions();
  
  
  const panelRef = useRef<HTMLElement>(null);
  const musicPanelRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  
  const route = getRoute(router.asPath);
  const isHomePage = router.asPath === "/";
  
  // Dock spacing configuration from environment
  const dockSpacingMode = getDefaultDockSpacingMode();
  const dockSpacingExtended = getDefaultDockSpacingExtended();
  const dockSpacingCompact = getDefaultDockSpacingCompact();
  const dockGapSize = getDefaultDockGapSize();

  // Move hook calls outside conditional usage
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);

  useClickAway(panelRef, (event) => {
    const isDockClick = dockRef.current?.contains(event.target as Node);
    if (!isDockClick) {
      setIsConfigActive(false);
      setIsSocialPopupVisible(false);
    }
  });

  useClickAway(musicPanelRef, (event) => {
    const isDockClick = dockRef.current?.contains(event.target as Node);
    if (!isDockClick) {
      setIsMusicActive(false);
    }
  });

  useKey("Escape", () => {
    setIsConfigActive(false);
    setIsMusicActive(false);
    setIsSocialPopupVisible(false);
  });

  // Calculate magnification based on hover (disabled on mobile)
  const getMagnification = (index: number): number => {
    if (isMobile || hoveredIndex === null) return 1;
    
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.33; // Primary hover: 64px (48px * 1.33)
    if (distance === 1) return 1.17; // Adjacent: 56px (48px * 1.17)
    if (distance === 2) return 1.08; // Second adjacent: 52px (48px * 1.08)
    return 1; // Default: 48px
  };

  // Get the appropriate extended dock setting based on current platform
  const getShowExtendedDock = useCallback((): boolean => {
    return isMobile ? showExtendedDockMobile.val : showExtendedDockDesktop.val;
  }, [isMobile, showExtendedDockMobile.val, showExtendedDockDesktop.val]);

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
    
    const settingsCount = 1;
    const totalIcons = coreNavigationCount + extendedNavigationCount + socialCount + settingsCount;

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
    
    // Base glassmorphism styling
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",

    // Theme-specific adjustments
    ...(isSoftTheme && {
      background: "rgba(255, 255, 255, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    }),

    ...(isClassicTheme && {
      background: "rgba(248, 243, 231, 0.2)",
      border: "1px solid rgba(0, 0, 0, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    }),

    ...(isTronTheme && {
      background: "rgba(40, 142, 159, 0.15)",
      border: "1px solid rgba(40, 142, 159, 0.3)",
      boxShadow: "0 8px 32px rgba(40, 142, 159, 0.4)",
    }),

    ...(isCyberpunkTheme && {
      background: "rgba(26, 0, 51, 0.8)",
      border: "1px solid",
      borderColor: "highlight",
      boxShadow: "0 0 20px rgba(255, 0, 128, 0.6), 0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(255, 0, 128, 0.1)",
      backdropFilter: "blur(20px) saturate(1.2)",
    }),

    // Mobile taskbar styling - full width, no rounded corners
    ...(isMobile && {
      width: "100%",
      padding: "8px 12px",
      borderRadius: "0",
      gap: `${gapSize}px`,
      justifyContent: needsScrolling ? "flex-start" : getDockJustification(), // Use configured spacing
      border: isCyberpunkTheme ? "1px solid" : "none",
      borderColor: isCyberpunkTheme ? "highlight" : undefined,
      borderTop: isCyberpunkTheme ? "1px solid" : "1px solid rgba(255, 255, 255, 0.2)",
      borderTopColor: isCyberpunkTheme ? "highlight" : undefined,
      boxShadow: isCyberpunkTheme 
        ? "0 0 20px rgba(255, 0, 128, 0.6), 0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(255, 0, 128, 0.1)"
        : "0 -4px 20px rgba(0, 0, 0, 0.3)",
      ...(isCyberpunkTheme && {
        background: "rgba(26, 0, 51, 0.9)",
      }),
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

  // Music icon
  const MusicIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      sx={{ opacity: 0.8 }}
    >
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );

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
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              zIndex: zIndex.taskbar,
              
              // Theme-specific adjustments
              ...(isSoftTheme && {
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              }),

              ...(isClassicTheme && {
                background: "rgba(248, 243, 231, 0.2)",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }),

              ...(isTronTheme && {
                background: "rgba(40, 142, 159, 0.15)",
                border: "1px solid rgba(40, 142, 159, 0.3)",
                boxShadow: "0 8px 32px rgba(40, 142, 159, 0.4)",
              }),

              ...(isCyberpunkTheme && {
                background: "rgba(26, 0, 51, 0.8)",
                border: "1px solid",
                borderColor: "highlight",
                boxShadow: "0 0 20px rgba(255, 0, 128, 0.6), 0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(255, 0, 128, 0.1)",
              }),
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
      iconName: "FlatAbout" as const,
      customIcon: undefined,
      label: "About Me",
      onClick: () => router.push("/about"),
      href: undefined,
      isActive: router.asPath === "/about",
      isNavigationIcon: true,
    },
    {
      iconName: "FlatWork" as const,
      customIcon: undefined,
      label: "My Work",
      onClick: () => router.push("/work"),
      href: undefined,
      isActive: router.asPath === "/work",
      isNavigationIcon: true,
    },
    {
      iconName: "FlatSkills" as const,
      customIcon: undefined,
      label: "Skills",
      onClick: () => router.push("/skills"),
      href: undefined,
      isActive: router.asPath === "/skills",
      isNavigationIcon: true,
    },
    {
      iconName: "FlatEdu" as const,
      customIcon: undefined,
      label: "Research Paper",
      onClick: () => router.push("/research-paper"),
      href: undefined,
      isActive: router.asPath === "/research-paper",
      isNavigationIcon: true,
    },
    {
      iconName: "FlatAbout" as const,
      customIcon: undefined,
      label: "My Mindset",
      onClick: () => router.push("/mindset"),
      href: undefined,
      isActive: router.asPath === "/mindset",
      isNavigationIcon: true,
    },
    {
      iconName: "FlatWork" as const,
      customIcon: undefined,
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
        customIcon: <div sx={{ width: "2px", height: "32px", background: "rgba(255,255,255,0.3)", borderRadius: "1px" }} aria-hidden="true" />,
        label: "Separator",
        onClick: () => {},
        href: undefined,
        isActive: false,
        isNavigationIcon: false,
      }] : []),
      ...desktopSocialIcons
    ]),
    
    // Music player
    {
      iconName: undefined,
      customIcon: <MusicIcon />,
      label: "Music",
      onClick: () => {
        setIsMusicActive(!isMusicActive);
        if (!isMusicActive) setIsConfigActive(false); // Close settings when opening music
      },
      href: undefined,
      isActive: isMusicActive,
      isNavigationIcon: false,
    },

    // Settings (always present)
    {
      iconName: "FlatSettings" as const,
      customIcon: undefined,
      label: "Settings",
      onClick: () => {
        setIsConfigActive(!isConfigActive);
        if (!isConfigActive) setIsMusicActive(false); // Close music when opening settings
      },
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

      {/* Backdrop overlay for mobile music panel */}
      <AnimatePresence>
        {isMobile && isMusicActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMusicActive(false)}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 99,
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <PanelConfig isVisible={isConfigActive} ref={panelRef} />
      <MusicPlayer isVisible={isMusicActive} ref={musicPanelRef} />
    </>
  );
}