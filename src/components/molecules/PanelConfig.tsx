import { lighten } from "@theme-ui/color";
import { Variants } from "framer-motion";
import { ForwardedRef, forwardRef, useContext } from "react";
import { ThemeUICSSObject } from "theme-ui";
import { GlobalContext, BackgroundMode } from "../../contexts/GlobalContext";
import useMatchTheme from "../../hooks/useMatchTheme";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useReduceMotion from "../../hooks/useReduceMotion";
import useTaskbarHeight from "../../hooks/useTaskbarHeight";
import { sizes, ThemeMode } from "../../themes";
import { zIndex } from "../../themes/common";
import { List, MotionBox } from "../atoms/Container";
import ThemeButton from "../atoms/ThemeButton";
import Toggle from "../atoms/Toggle";

type PanelConfigProps = {
  isVisible?: boolean;
};

const PanelConfig = ({ isVisible }: PanelConfigProps, ref: ForwardedRef<HTMLElement>) => {
  const { reduceMotion, hideTaskbar, background, glassAnimations, showExtendedDockDesktop, showExtendedDockMobile, showWelcome, dockMagnification } = useContext(GlobalContext);

  // Move hook calls outside conditional usage
  const isMobile = useInBreakpoint(1);
  const taskbarHeight = useTaskbarHeight();
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);
  const isLiquidGlassTheme = useMatchTheme(ThemeMode.LiquidGlass);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);

  // Get the appropriate extended dock setting and setter based on current platform
  const currentShowExtendedDock = isMobile ? showExtendedDockMobile : showExtendedDockDesktop;

  const panelConfigStyle: ThemeUICSSObject = {
    p: 4,
    bg: "primary",
    color: "textReverse",
    zIndex: 100, // High z-index to ensure visibility above dock

    // Desktop: absolute positioning from left
    ...(!isMobile && {
      position: "absolute",
      left: 2,
      bottom: taskbarHeight + sizes[2],
      borderRadius: "8px",
    }),

    // Mobile: bottom sheet style, sitting above the dock
    ...(isMobile && {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: taskbarHeight,
      borderRadius: "16px 16px 0 0",
      maxHeight: "70vh",
      overflowY: "auto",
      paddingBottom: "env(safe-area-inset-bottom, 16px)",
    }),

    ...(isSoftTheme && {
      bg: lighten("primary", 0.02),
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    }),

    ...(isClassicTheme && {
      bg: "background",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)",
    }),

    ...(isTronTheme && {
      boxShadow: "0 4px 20px rgba(40, 142, 159, 0.3), 0 0 0 1px var(--theme-ui-colors-shadow)",
    }),

    ...(isLiquidGlassTheme && {
      bg: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(20px) saturate(1.8)",
      WebkitBackdropFilter: "blur(20px) saturate(1.8)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    }),

    ...(isCyberpunkTheme && {
      bg: "primary",
      border: "1px solid var(--theme-ui-colors-highlight)",
      boxShadow: "0 0 20px rgba(255, 0, 128, 0.6), 0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(255, 0, 128, 0.1)",
      color: "highlight",
    }),

    // Default theme (Flat) with Mac-style shadow
    ...(!isSoftTheme && !isClassicTheme && !isTronTheme && !isLiquidGlassTheme && !isCyberpunkTheme && {
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)",
    }),
  };

  const reduceMotionTransition = useReduceMotion();

  // Mobile: slide up from below the dock
  const mobileVariants: Variants = {
    hidden: { y: `calc(100% + ${taskbarHeight}px)`, x: 0 },
    visible: { y: 0, x: 0 },
  };

  // Desktop: slide from left
  const desktopVariants: Variants = {
    hidden: { x: "-105%", y: 0 },
    visible: { x: 0, y: 0 },
  };

  return (
    <MotionBox
      ref={ref}
      sx={panelConfigStyle}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={isMobile ? mobileVariants : desktopVariants}
      transition={{ duration: 0.3, ease: "easeOut" }}
      role="dialog"
      aria-label="Settings"
      aria-hidden={!isVisible}
    >
      <List sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 4 }}>
        <li>
          <ThemeButton theme={ThemeMode.Flat} />
        </li>
        <li>
          <ThemeButton theme={ThemeMode.Soft} />
        </li>
        <li>
          <ThemeButton theme={ThemeMode.Tron} />
        </li>
        <li>
          <ThemeButton theme={ThemeMode.Classic} />
        </li>
        <li>
          <ThemeButton theme={ThemeMode.LiquidGlass} />
        </li>
        <li>
          <ThemeButton theme={ThemeMode.Cyberpunk} />
        </li>
      </List>
      <Toggle
        id="toggle-reduceMotion"
        label="Reduce motion"
        isChecked={reduceMotion.val}
        onChange={() => reduceMotion.set(!reduceMotion.val)}
        style={{ mb: 3 }}
      />
      <Toggle
        id="toggle-hideTaskbar"
        label="Hide taskbar"
        isChecked={hideTaskbar.val}
        onChange={() => hideTaskbar.set(!hideTaskbar.val)}
        style={{ mb: 3 }}
      />
      <Toggle
        id="toggle-showExtendedDock"
        label={`Show extended dock (${isMobile ? 'Mobile' : 'Desktop'})`}
        isChecked={currentShowExtendedDock.val}
        onChange={() => currentShowExtendedDock.set(!currentShowExtendedDock.val)}
        style={{ mb: 3 }}
      />
      {!isMobile && (
        <Toggle
          id="toggle-dockMagnification"
          label="Dock magnification"
          isChecked={dockMagnification.val}
          onChange={() => dockMagnification.set(!dockMagnification.val)}
          style={{ mb: 3 }}
        />
      )}
      
      <div sx={{ mb: 3 }}>
        <span sx={{ fontSize: 1, fontWeight: "bold", mb: 2, display: "block" }}>
          Background
        </span>
        <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Toggle
            id="toggle-background-none"
            label="None"
            isChecked={background.val === BackgroundMode.None}
            onChange={() => background.set(BackgroundMode.None)}
          />
          <Toggle
            id="toggle-background-custom"
            label="My background"
            isChecked={background.val === BackgroundMode.Custom}
            onChange={() => background.set(BackgroundMode.Custom)}
          />
          <Toggle
            id="toggle-background-random"
            label="Random nature"
            isChecked={background.val === BackgroundMode.Random}
            onChange={() => background.set(BackgroundMode.Random)}
          />
        </div>
      </div>

      <Toggle
        id="toggle-showWelcome"
        label="Welcome screen"
        isChecked={showWelcome.val}
        onChange={() => showWelcome.set(!showWelcome.val)}
        style={{ mb: 3 }}
      />

      {isLiquidGlassTheme && (
        <Toggle
          id="toggle-glass-animations"
          label="Glass animations"
          isChecked={glassAnimations.val}
          onChange={() => glassAnimations.set(!glassAnimations.val)}
          style={{ mb: 3 }}
        />
      )}
    </MotionBox>
  );
};

export default forwardRef(PanelConfig);
