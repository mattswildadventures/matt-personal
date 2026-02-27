import { useIsPresent } from "framer-motion";
import { ReactNode, useContext, useRef, useState } from "react";
import { ThemeUICSSObject } from "theme-ui";
import { fadeZoomIn } from "../../animations/fade";
import { dockScaleIn, dockScaleInFallback } from "../../animations/dockScale";
import { GlobalContext } from "../../contexts/GlobalContext";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useIsLandscape from "../../hooks/useIsLandscape";
import useMatchTheme from "../../hooks/useMatchTheme";
import useTaskbarHeight from "../../hooks/useTaskbarHeight";
import { ThemeMode } from "../../themes";
import { zIndex } from "../../themes/common";
import { Box, MotionBox } from "../atoms/Container";
import LiquidGlass from "../atoms/LiquidGlass";
import WindowBody from "../atoms/window/Body";
import WindowTitle from "../atoms/window/Title";

type WindowProps = {
  title?: ReactNode;
  children?: ReactNode;
  help?: string;
};

export default function Window({ title, children, help }: WindowProps) {
  const { reduceMotion } = useContext(GlobalContext);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const isPresent = useIsPresent();
  const isLandscape = useIsLandscape();
  const isMobile = useInBreakpoint(1); // Use 768px breakpoint for better mobile detection
  const taskbarHeight = useTaskbarHeight();
  const toggleExpanded = () => setExpanded((prev) => !prev);
  const w = ["100%", null, null, 900];
  const h = isMobile
    ? "100%"
    : expanded
      ? `calc(100dvh - ${taskbarHeight}px - 16px)`
      : "75vh";

  const Container = reduceMotion.val ? Box : MotionBox;
  
  // Check if we have a dock origin for the animation
  const hasDockOrigin = typeof window !== 'undefined' && sessionStorage.getItem('windowOrigin');
  const animation = hasDockOrigin ? dockScaleIn : dockScaleInFallback;
  
  // Move hook calls outside conditional usage
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);
  const isLiquidGlassTheme = useMatchTheme(ThemeMode.LiquidGlass);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);

  const style: ThemeUICSSObject = {
    maxWidth: w,
    minWidth: w,
    height: h,
    maxHeight: h,
    display: "flex",
    flexDirection: "column",
    zIndex: zIndex.window,
    overflow: "hidden",
    transition: "height 0.3s ease, max-height 0.3s ease",

    // Apply Mac-style 12px border radius to all themes, remove on mobile for square edges
    borderRadius: isMobile ? "0" : "12px",
    
    // Mobile-specific positioning to fill available space properly
    ...(isMobile && {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      margin: 0,
    }),

    ...(isSoftTheme && {
      bg: "primary",
      boxShadow: (theme) => `0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)`,
    }),

    ...(isClassicTheme && {
      bg: "background",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)",
    }),

    ...(isTronTheme && {
      boxShadow: (theme) => `0 4px 20px rgba(40, 142, 159, 0.3), 0 0 0 1px ${theme.colors?.shadow}`,
    }),

    ...(isLiquidGlassTheme && {
      bg: "transparent",
      boxShadow: "none",
    }),

    ...(isCyberpunkTheme && {
      bg: "primary",
      border: "1px solid var(--theme-ui-colors-highlight)",
      boxShadow: "0 0 20px rgba(255, 0, 128, 0.6), 0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(255, 0, 128, 0.1)",
    }),

    // Default theme (Flat)
    ...(!isSoftTheme && !isClassicTheme && !isTronTheme && !isLiquidGlassTheme && !isCyberpunkTheme && {
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)",
    }),
  };

  const WindowContent = (
    <>
      <WindowTitle onFullscreen={toggleExpanded} help={help}>
        {isPresent && title}
      </WindowTitle>
      <WindowBody>{children}</WindowBody>
    </>
  );

  if (isLiquidGlassTheme) {
    return (
      <Container ref={ref} sx={style} {...animation}>
        <LiquidGlass intensity="standard" interactive>
          {WindowContent}
        </LiquidGlass>
      </Container>
    );
  }

  return (
    <Container ref={ref} sx={style} {...animation}>
      {WindowContent}
    </Container>
  );
}
