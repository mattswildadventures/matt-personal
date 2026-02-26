import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ThemeUICSSObject } from "theme-ui";
import { GlobalContext } from "../../contexts/GlobalContext";
import useMatchTheme from "../../hooks/useMatchTheme";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useTaskbarHeight from "../../hooks/useTaskbarHeight";
import { ThemeMode } from "../../themes";

type WelcomeScreenProps = {
  onHighlight: (route: string | null) => void;
  onComplete: () => void;
};

const snippets = [
  {
    text: "14 years from tennis coaching to founding Minnio. The full timeline lives in Work.",
    route: "/work",
  },
  {
    text: "Writing a research paper that maps the architecture and construction of our mindset, exploring how patterns, language, and experience shape the way we think.",
    route: "/research-paper",
  },
  {
    text: "Antifragile thinking. First principles. Systems thinking. The mental models behind the work, collected in Mindset.",
    route: "/mindset",
  },
  {
    text: "The toolkit behind over a decade of running businesses, supporting 100+ companies, from startups to ASX-listed. Browse them in Skills.",
    route: "/skills",
  },
  {
    text: "Adventurer. OCR athlete. Represented Australia. Backpacked 23 countries. More in About.",
    route: "/about",
  },
  {
    text: "Where I've been, where I'm heading, and what I'm building next. Mapped out in Roadmap.",
    route: "/roadmap",
  },
];

export default function WelcomeScreen({ onHighlight, onComplete }: WelcomeScreenProps) {
  const router = useRouter();
  const { showWelcome, reduceMotion } = useContext(GlobalContext);
  const isMobile = useInBreakpoint(1);
  const taskbarHeight = useTaskbarHeight();

  // Phases: greeting → cycling → idle (stays open) → exiting → done
  const [phase, setPhase] = useState<"greeting" | "cycling" | "idle" | "exiting" | "done">("greeting");
  const [snippetsVisible, setSnippetsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const snippetRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const isTronTheme = useMatchTheme(ThemeMode.Tron);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isLiquidGlassTheme = useMatchTheme(ThemeMode.LiquidGlass);

  const isDark = isTronTheme || isCyberpunkTheme;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  // If reduce motion, skip the whole sequence
  useEffect(() => {
    if (reduceMotion.val) {
      showWelcome.set(false);
      onComplete();
      setPhase("done");
    }
  }, []);

  // Greeting phase → show snippets → start cycling
  useEffect(() => {
    if (phase === "greeting") {
      addTimer(() => setSnippetsVisible(true), 1600);
      addTimer(() => {
        setPhase("cycling");
        setActiveIndex(0);
      }, 2600);
    }
    return clearTimers;
  }, [phase, addTimer, clearTimers]);

  // Cycling through snippets — slower pace (2.5s per snippet)
  useEffect(() => {
    if (phase !== "cycling" || activeIndex < 0) return;

    if (activeIndex < snippets.length) {
      onHighlight(snippets[activeIndex].route);
      addTimer(() => setActiveIndex((i) => i + 1), 2500);
    } else {
      // Done cycling — go idle, panel stays open
      onHighlight(null);
      setActiveIndex(-1);
      setPhase("idle");
    }
    return clearTimers;
  }, [phase, activeIndex, addTimer, clearTimers, onHighlight]);

  // Hover overrides highlight
  useEffect(() => {
    if (hoveredIndex !== null) {
      onHighlight(snippets[hoveredIndex].route);
    } else if (phase === "cycling" && activeIndex >= 0 && activeIndex < snippets.length) {
      onHighlight(snippets[activeIndex].route);
    } else {
      onHighlight(null);
    }
  }, [hoveredIndex, phase, activeIndex, onHighlight]);

  // Dismiss handler — used by Skip, Explore, and clicking outside
  const handleDismiss = useCallback(() => {
    clearTimers();
    onHighlight(null);
    setPhase("exiting");
    // After exit animation, mark done
    setTimeout(() => {
      showWelcome.set(false);
      setPhase("done");
      onComplete();
    }, 600);
  }, [clearTimers, onHighlight, showWelcome, onComplete]);

  const handleSnippetClick = useCallback(
    (route: string) => {
      clearTimers();
      onHighlight(null);
      showWelcome.set(false);
      setPhase("done");
      onComplete();
      router.push(route);
    },
    [router, clearTimers, onHighlight, showWelcome, onComplete]
  );

  if (phase === "done") return null;

  // The currently focused index (hover takes priority, then cycling, then nothing)
  const focusedIndex = hoveredIndex !== null
    ? hoveredIndex
    : (phase === "cycling" && activeIndex >= 0 && activeIndex < snippets.length)
      ? activeIndex
      : hoveredIndex;

  // Glass panel background per theme
  const getPanelBg = (): string => {
    if (isCyberpunkTheme) return "rgba(26, 0, 51, 0.35)";
    if (isTronTheme) return "rgba(0, 29, 35, 0.35)";
    if (isSoftTheme) return "rgba(226, 227, 240, 0.45)";
    if (isClassicTheme) return "rgba(243, 235, 217, 0.45)";
    if (isLiquidGlassTheme) return "rgba(255, 255, 255, 0.15)";
    return "rgba(255, 255, 255, 0.1)";
  };

  const getPanelBorder = (): string => {
    if (isCyberpunkTheme) return "1px solid rgba(0, 255, 255, 0.3)";
    if (isTronTheme) return "1px solid rgba(40, 142, 159, 0.4)";
    if (isSoftTheme) return "1px solid rgba(147, 161, 210, 0.3)";
    if (isClassicTheme) return "1px solid rgba(0, 0, 0, 0.1)";
    if (isLiquidGlassTheme) return "1px solid rgba(255, 255, 255, 0.3)";
    return "1px solid rgba(255, 255, 255, 0.2)";
  };

  const getPanelShadow = (): string => {
    if (isCyberpunkTheme) return "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(255, 0, 128, 0.15), inset 0 1px 0 rgba(0, 255, 255, 0.1)";
    if (isTronTheme) return "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 40px rgba(40, 142, 159, 0.15), inset 0 1px 0 rgba(173, 234, 235, 0.1)";
    if (isSoftTheme) return "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)";
    if (isClassicTheme) return "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
    if (isLiquidGlassTheme) return "0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
    return "0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
  };

  const getTextColor = (): string => {
    if (isCyberpunkTheme) return "#00ffff";
    if (isTronTheme) return "#adeaeb";
    if (isSoftTheme) return "#232246";
    if (isClassicTheme) return "#5a4530";
    if (isLiquidGlassTheme) return "#ffffff";
    return "#ffffff";
  };

  const textColor = getTextColor();
  const hasFocus = focusedIndex !== null;
  const isFinished = phase === "idle";

  const containerStyle: ThemeUICSSObject = {
    position: "fixed",
    inset: 0,
    zIndex: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: isMobile
      ? (isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.5)")
      : (isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.1)"),
    paddingBottom: `${taskbarHeight}px`,
  };

  const panelStyle: ThemeUICSSObject = {
    position: "relative",
    maxWidth: isMobile ? "calc(100vw - 32px)" : "740px",
    width: "100%",
    minHeight: isMobile ? "auto" : "400px",
    background: getPanelBg(),
    backdropFilter: "blur(12px) saturate(1.4)",
    WebkitBackdropFilter: "blur(12px) saturate(1.4)",
    border: getPanelBorder(),
    borderRadius: "16px",
    boxShadow: getPanelShadow(),
    padding: isMobile ? "32px 24px" : "48px 52px",
    overflow: "hidden",
  };

  const buttonStyle: ThemeUICSSObject = {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "1px solid",
    borderColor: textColor,
    borderRadius: "6px",
    color: textColor,
    cursor: "pointer",
    fontSize: "12px",
    padding: "4px 14px",
    letterSpacing: "0.5px",
    opacity: 0.6,
    transition: "all 0.3s ease",
    "&:hover": {
      opacity: 1,
    },
  };

  const greetingStyle: ThemeUICSSObject = {
    color: textColor,
    fontSize: [24, 30, 36],
    fontWeight: 400,
    mb: [4, 5],
    letterSpacing: "-0.5px",
    textShadow: "0 1px 4px rgba(0, 0, 0, 0.4)",
  };

  return (
    <motion.div
      sx={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "exiting" ? 0 : 1 }}
      transition={{ duration: phase === "exiting" ? 0.5 : 0.4 }}
      onClick={handleDismiss}
    >
      {/* Glass panel */}
      <motion.div
        sx={panelStyle}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{
          opacity: phase === "exiting" ? 0 : 1,
          y: phase === "exiting" ? -20 : 0,
          scale: 1,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Skip / Explore button */}
        <motion.button
          onClick={handleDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isFinished ? 0 : 1, duration: 0.3 }}
          sx={buttonStyle}
        >
          {isFinished ? "Explore" : "Skip"}
        </motion.button>

        {/* Greeting */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          sx={greetingStyle}
        >
          Hey, I&apos;m Matt.
        </motion.h1>

        {/* Snippets with sliding focus indicator */}
        <div sx={{ position: "relative" }}>
          {/* Sliding accent bar — uses layoutId for smooth movement */}
          {focusedIndex !== null && snippetsVisible && (
            <motion.div
              layoutId="welcome-focus-bar"
              sx={{
                position: "absolute",
                left: 0,
                width: "2px",
                background: "highlight",
                borderRadius: "1px",
                // Glow effect on the bar
                boxShadow: (theme: any) => {
                  const c = theme.colors?.highlight || "#1abc9c";
                  return `0 0 8px ${c}, 0 0 16px ${c}60`;
                },
              }}
              style={{
                top: snippetRefs.current[focusedIndex]?.offsetTop ?? 0,
                height: snippetRefs.current[focusedIndex]?.offsetHeight ?? 24,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          {snippets.map((snippet, index) => {
            const isFocused = focusedIndex === index;

            return (
              <motion.p
                key={snippet.route}
                ref={(el) => { snippetRefs.current[index] = el; }}
                initial={{ opacity: 0, x: -16 }}
                animate={{
                  opacity: snippetsVisible ? (hasFocus ? (isFocused ? 1 : 0.4) : 0.7) : 0,
                  x: snippetsVisible ? 0 : -16,
                }}
                transition={{
                  opacity: { duration: 0.3, delay: snippetsVisible ? index * 0.08 : 0 },
                  x: { duration: 0.4, delay: index * 0.08 },
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleSnippetClick(snippet.route)}
                sx={{
                  color: textColor,
                  fontSize: [13, 14, 16],
                  fontWeight: 400,
                  lineHeight: 1.8,
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.35)",
                  mb: [2, "16px"],
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  transform: isFocused ? "translateX(6px)" : "translateX(0)",
                  paddingLeft: "16px",
                  userSelect: "none",
                  "&:last-child": {
                    mb: 0,
                  },
                }}
              >
                {snippet.text}
              </motion.p>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
