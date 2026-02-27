import { lighten } from "@theme-ui/color";
import { ReactNode } from "react";
import { ThemeUICSSObject } from "theme-ui";
import useInBreakpoint from "../../../hooks/useInBreakpoint";
import useMatchTheme from "../../../hooks/useMatchTheme";
import useTaskbarHeight from "../../../hooks/useTaskbarHeight";
import { ThemeMode } from "../../../themes";

type WindowBodyProps = {
  children: ReactNode;
};

export default function WindowBody({ children }: WindowBodyProps) {
  const isMobile = useInBreakpoint(1); // Use 768px breakpoint for consistency
  const taskbarHeight = useTaskbarHeight();
  const isTronTheme = useMatchTheme(ThemeMode.Tron);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);
  
  const bodyStyle: ThemeUICSSObject = {
    bg: "white",
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",

    // Mobile-specific scrolling enhancements and dock spacing
    ...(isMobile && {
      // Ensure proper touch scrolling
      WebkitOverflowScrolling: "touch",
      // Prevent momentum scrolling from affecting parent
      overscrollBehavior: "contain",
      // Smooth scrolling for better UX
      scrollBehavior: "smooth",
      // Add bottom padding to prevent content from going behind dock
      paddingBottom: `${taskbarHeight + 16}px`,
    }),

    ...(!useMatchTheme(ThemeMode.Flat) && { bg: "background" }),

    ...(isTronTheme && {
      background: (theme) =>
        `linear-gradient(135deg, ${theme.colors?.background} 10%, ${lighten("background", 0.1)(theme)})`,
    }),

    ...(isCyberpunkTheme && {
      background: "rgba(13, 2, 8, 0.95)",
      border: "1px solid rgba(0, 255, 255, 0.2)",
      boxShadow: "inset 0 0 20px rgba(255, 0, 128, 0.1), inset 0 1px 0 rgba(0, 255, 255, 0.1)",
    }),
  };

  return <div data-window-body sx={bodyStyle}>{children}</div>;
}
