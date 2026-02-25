import { motion, Transition, Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { ThemeUICSSObject } from "theme-ui";
import { useBackgroundLuminance } from "../../hooks/useBackgroundLuminance";
import useHomepage from "../../hooks/useHomepage";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useIsLandscape from "../../hooks/useIsLandscape";
import useMatchTheme from "../../hooks/useMatchTheme";
import useReduceMotion from "../../hooks/useReduceMotion";
import useDimensions from "../../hooks/useDimentions";
import { Route } from "../../misc/routes";
import { sizes, ThemeMode } from "../../themes";
import { MotionIcon } from "./Icon";

type NavLinkProps = {
  data: Route;
};

export default function NavLink({ data }: NavLinkProps) {
  const isHomePage = useHomepage();
  const isLandscape = useIsLandscape();
  const isMobile = useInBreakpoint(0, isLandscape);
  const { width: screenWidth } = useDimensions();
  
  // Smart layout detection - same logic as Navigation component
  const getOptimalLayout = () => {
    const tileSize = 150;
    const gapSize = 16;
    const padding = 40;
    const widthFor3x2 = (tileSize * 3) + (gapSize * 2) + padding;
    const safetyMargin = 20;
    const minWidthFor3x2 = widthFor3x2 + safetyMargin;
    
    return screenWidth >= minWidthFor3x2 ? '3x2' : '2x3';
  };

  const layout = getOptimalLayout();
  const isNarrowLayout = layout === '2x3';
  
  // Responsive sizing for tiles with adequate touch targets
  const defaultSize = (() => {
    if (isNarrowLayout) return 150; // Narrow layout: consistent 150px tiles
    if (isMobile && isLandscape) return 130; // Mobile landscape: smaller
    return 160; // Desktop wide: original size
  })();
  
  const sidebarSize = defaultSize / 2;
  const isActive = useRouter().asPath === data.path;
  
  // Move hook calls outside conditional usage
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);
  const isLiquidGlassTheme = useMatchTheme(ThemeMode.LiquidGlass);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);
  const backgroundLuminance = useBackgroundLuminance();

  const linkVariants: Variants = {
    main: {
      width: defaultSize,
      height: defaultSize,
      opacity: 1,
      // Use margin only for desktop wide layout, narrow layout uses grid gap
      margin: isNarrowLayout ? 0 : sizes[isMobile && isLandscape ? 2 : 3],
      transition: useReduceMotion({ duration: 0.6, delay: 0.3 }),
    },
  };

  const iconVariants: Variants = {
    main: {
      width: sidebarSize,
      height: sidebarSize,
      transition: useReduceMotion({ duration: 1 }),
    },
  };

  const labelVariants: Variants = {
    main: {
      height: "auto",
      opacity: 1,
      marginTop: sizes[3],
      transition: useReduceMotion({ duration: 1 }),
    },
  };

  const linkStyle: ThemeUICSSObject = {
    bg: "primary",
    color: "textReverse",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    textDecoration: "none",
    size: defaultSize,
    position: "relative",

    // Apply Mac-style 8px border radius to all dashboard tiles
    borderRadius: "8px",

    ...(isSoftTheme && {
      fontSize: isHomePage ? "2px" : "1px",
      boxShadow: (theme) => `0 2px 10px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
    }),

    ...(isClassicTheme && {
      fontSize: isHomePage ? "2px" : "1px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)",
    }),

    ...(isTronTheme && {
      bg: "highlight",
      boxShadow: (theme) => `0 2px 10px rgba(40, 142, 159, 0.3), 0 0 0 1px ${theme.colors?.shadow}`,
    }),

    ...(isLiquidGlassTheme && {
      // Enhanced glass backdrop for better text contrast
      bg: backgroundLuminance.isDark 
        ? "rgba(255, 255, 255, 0.25)" // Lighter glass on dark backgrounds
        : "rgba(255, 255, 255, 0.15)", // Standard glass on light backgrounds
      backdropFilter: "blur(20px) saturate(1.8) brightness(1.1)",
      WebkitBackdropFilter: "blur(20px) saturate(1.8) brightness(1.1)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      
      // Adaptive text color based on background
      color: backgroundLuminance.textColor,
      
      // Add text shadow for extra contrast on challenging backgrounds
      textShadow: backgroundLuminance.isDark 
        ? "0 1px 2px rgba(0, 0, 0, 0.8), 0 0 4px rgba(0, 0, 0, 0.3)" // Dark shadow for white text
        : "0 1px 2px rgba(255, 255, 255, 0.8), 0 0 4px rgba(255, 255, 255, 0.3)", // Light shadow for black text
      
      // Smooth color transitions
      transition: "color 0.3s ease, text-shadow 0.3s ease, background-color 0.3s ease",
    }),

    ...(isCyberpunkTheme && {
      bg: "primary",
      color: "highlight",
      border: "1px solid var(--theme-ui-colors-highlight)",
      boxShadow: "0 0 15px rgba(255, 0, 128, 0.5), 0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 15px rgba(255, 0, 128, 0.1)",
    }),

    // Default theme (Flat) with Mac-style shadow
    ...(!isSoftTheme && !isClassicTheme && !isTronTheme && !isLiquidGlassTheme && !isCyberpunkTheme && {
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)",
    }),
  };

  const indicatorStyle: ThemeUICSSObject = {
    size: sidebarSize / 9,
    bg: "highlight",
    borderRadius: "50%",
    position: "absolute",
    top: 2,
    right: 2,

    ...(useMatchTheme(ThemeMode.Classic) && {
      boxShadow: "0 0 0 2px #000",
    }),

    ...(useMatchTheme(ThemeMode.Tron) && {
      bg: "red",
      boxShadow: (theme) => `0 0 0 1.5px ${theme.colors?.shadow}`,
    }),

    ...(useMatchTheme(ThemeMode.Cyberpunk) && {
      bg: "highlight",
      boxShadow: "0 0 8px rgba(0, 255, 255, 0.8), 0 0 16px rgba(0, 255, 255, 0.4)",
    }),
  };

  const spring: Transition = { type: "spring", duration: 0.5 };

  return (
    <Link href={data.path} passHref={true}>
      <motion.a
        href={data.path}
        sx={linkStyle}
        variants={linkVariants}
        animate="main"
        initial="main"
        whileHover={{ scale: 0.95 }}
        whileTap={{ scale: 0.9 }}
        aria-label={data.title}
        aria-current={isActive ? "page" : undefined}
        title={data.title}
      >
        {isActive && <motion.span layoutId="indicator" sx={indicatorStyle} transition={spring} />}
        <MotionIcon
          variants={iconVariants}
          animate="main"
          initial="main"
          iconName={data.icon}
          tag="span"
        />
        <motion.span
          variants={labelVariants}
          animate="main"
          initial="main"
          sx={{ 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            fontSize: isNarrowLayout ? 14 : (isMobile && isLandscape ? 16 : 20),
            textAlign: "center"
          }}
        >
          {data.title}
        </motion.span>
      </motion.a>
    </Link>
  );
}
