import { Variants } from "framer-motion";
import { ThemeUICSSObject } from "theme-ui";
import useHomepage from "../../hooks/useHomepage";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useReduceMotion from "../../hooks/useReduceMotion";
import useTaskbarHeight from "../../hooks/useTaskbarHeight";
import useDimensions from "../../hooks/useDimentions";
import routes from "../../misc/routes";
import { translate } from "../../misc/utils";
import { MotionNav } from "../atoms/Container";
import NavLink from "../atoms/NavLink";

export default function Navigation() {
  const isHomePage = useHomepage();
  const isMobile = useInBreakpoint(0);
  const mainTransition = useReduceMotion({ duration: 0.8 });
  const taskbarHeight = useTaskbarHeight();
  const { width: screenWidth, height: screenHeight } = useDimensions();
  
  // Only show navigation on homepage - left sidebar navigation removed
  if (!isHomePage) {
    return null;
  }

  // Smart layout detection - prioritize 3x2, fallback to 2x3
  const getOptimalLayout = () => {
    const tileSize = 150; // Current mobile tile size, will also work for desktop small screens
    const gapSize = 16; // Gap between tiles
    const padding = 40; // Container padding (20px each side)
    
    // Calculate space needed for 3x2 layout
    const widthFor3x2 = (tileSize * 3) + (gapSize * 2) + padding; // 3 tiles + 2 gaps + padding = 506px
    const heightFor3x2 = (tileSize * 2) + (gapSize * 1) + padding; // 2 rows + 1 gap + padding = 356px
    
    // Calculate space needed for 2x3 layout  
    const widthFor2x3 = (tileSize * 2) + (gapSize * 1) + padding; // 2 tiles + 1 gap + padding = 356px
    const heightFor2x3 = (tileSize * 3) + (gapSize * 2) + padding; // 3 rows + 2 gaps + padding = 522px
    
    // Add safety margin for comfortable spacing
    const safetyMargin = 20;
    const minWidthFor3x2 = widthFor3x2 + safetyMargin; // ~526px
    
    // Prefer 3x2 if there's enough width, otherwise use 2x3
    return screenWidth >= minWidthFor3x2 ? '3x2' : '2x3';
  };

  const layout = getOptimalLayout();
  const isNarrowLayout = layout === '2x3';


  const motionVariants: Variants = {
    main: {
      ...translate("-50%"),
      ...(isNarrowLayout ? {
        // For narrow layout (2x3), calculate true center accounting for taskbar
        // Available viewport = 100vh, taskbar takes up bottom space
        // Center in the remaining space above taskbar
        top: `calc((100vh - ${taskbarHeight}px) / 2)`, // Center in space above taskbar
      } : {
        top: "50%", // Standard centering for 3x2 layout
      }),
      left: "50%",
      display: "grid", // Always show grid, make it responsive
      transition: mainTransition,
    },
  };

  const containerStyle: ThemeUICSSObject = {
    display: "grid",
    gridTemplateColumns: isNarrowLayout ? "1fr 1fr" : "auto auto auto", // 2x3: 2 columns, 3x2: 3 columns
    gridTemplateRows: isNarrowLayout ? "repeat(3, auto)" : "repeat(2, auto)", // 2x3: 3 rows, 3x2: 2 rows
    gap: isNarrowLayout ? "16px" : "0", // Add gap for narrow layout, desktop keeps original spacing
    position: "absolute",
    
    // Narrow layout adjustments (applies to both mobile devices and narrow desktop windows)
    ...(isNarrowLayout && {
      width: "356px", // Exact width: 2*150px + 16px gap + 40px padding = 356px
      maxWidth: "calc(100vw - 20px)", // Ensure it doesn't exceed screen width with some margin
      padding: "20px",
      justifyItems: "center", // Center tiles within their grid areas
      alignItems: "center",   // Center tiles vertically within their grid areas
    }),
  };

  return (
    <MotionNav
      sx={containerStyle}
      variants={motionVariants}
      animate="main"
      initial="main"
      aria-label="Page navigation"
    >
      {routes.map((route) => (
        <NavLink key={route.path} data={route} />
      ))}
    </MotionNav>
  );
}
