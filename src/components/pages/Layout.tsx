import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Fragment, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { ThemeUICSSObject } from "theme-ui";
import { GlobalContext, BackgroundMode } from "../../contexts/GlobalContext";
import { useUnsplashBackground } from "../../hooks/useUnsplashBackground";
import useHomepage from "../../hooks/useHomepage";
import useMatchTheme from "../../hooks/useMatchTheme";
import useTaskbarHeight from "../../hooks/useTaskbarHeight";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import { ThemeMode } from "../../themes";

import Navigation from "../molecules/Navigation";
import MusicPlayer from "../molecules/MusicPlayer";
import WelcomeScreen from "../molecules/WelcomeScreen";
import Desktop from "../organisms/Desktop";
import MacDock from "../organisms/MacDock";

// Dark themes use different shimmer colors
const isDarkTheme = (theme: ThemeMode): boolean => {
  return theme === ThemeMode.Tron || theme === ThemeMode.Cyberpunk;
};

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { background, theme, showWelcome } = useContext(GlobalContext);
  const { imageUrl, attribution, loading, error, fetchRandomBackground, clearBackground } = useUnsplashBackground();
  const isHomePage = useHomepage();
  const isLiquidGlassTheme = useMatchTheme(ThemeMode.LiquidGlass);
  const taskbarHeight = useTaskbarHeight();
  const isMobile = useInBreakpoint(1);
  const useDarkShimmer = isDarkTheme(theme.val);

  // Welcome screen state
  const [highlightedRoute, setHighlightedRoute] = useState<string | null>(null);
  const [welcomeActive, setWelcomeActive] = useState(showWelcome.val && isHomePage);

  // Lifted music player state for dock integration on mobile
  const [isMusicExpanded, setIsMusicExpanded] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const toggleMusicExpanded = useCallback(() => {
    setIsMusicExpanded((prev) => !prev);
  }, []);

  const closeMusicPlayer = useCallback(() => {
    setIsMusicExpanded(false);
  }, []);

  // Dismiss welcome when global setting syncs to false (e.g. localStorage on load).
  // Toggling it back on in settings takes effect on next refresh, not immediately.
  useEffect(() => {
    if (!showWelcome.val) {
      setWelcomeActive(false);
    }
  }, [showWelcome.val]);

  const handleWelcomeComplete = useCallback(() => {
    setWelcomeActive(false);
    setHighlightedRoute(null);
  }, []);

  // Fetch random background when Random mode is selected
  useEffect(() => {
    if (background.val === BackgroundMode.Random) {
      fetchRandomBackground();
    } else {
      clearBackground();
    }
  }, [background.val, fetchRandomBackground, clearBackground]);

  const getBackgroundStyle = (): ThemeUICSSObject => {
    switch (background.val) {
      case BackgroundMode.Custom:
        return {
          backgroundImage: "url('/images/custom-background.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      case BackgroundMode.Random:
        // Show shimmer loading state while fetching image
        if (loading && !imageUrl) {
          const shimmerColors = useDarkShimmer
            ? "#1a1a2e 25%, #2d2d44 50%, #1a1a2e 75%"
            : "#e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%";
          return {
            background: `linear-gradient(90deg, ${shimmerColors})`,
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          };
        }
        if (imageUrl) {
          return {
            backgroundImage: `url('${imageUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transition: "background-image 0.6s ease-in",
          };
        }
        return { background: "secondary" };
      default:
        // Use special blue-gray background for Liquid Glass theme's "No background" option
        return {
          background: isLiquidGlassTheme ? "#e8eaf6" : "secondary",
        };
    }
  };

  const containerStyle: ThemeUICSSObject = {
    position: "relative",
    // Use proper mobile viewport units to avoid content going behind dock
    height: isMobile ? "100dvh" : "100vh",
    // Fallback for browsers that don't support dvh
    minHeight: isMobile ? "100vh" : "-webkit-fill-available",
    overflow: "hidden",
    ...getBackgroundStyle(),
  };

  return (
    <main sx={containerStyle}>
      <Desktop>
        <Navigation highlightedRoute={highlightedRoute} />
        <AnimatePresence exitBeforeEnter>
          <Fragment key={useRouter().asPath}>{children}</Fragment>
        </AnimatePresence>
      </Desktop>
      <MacDock
        welcomeActive={welcomeActive}
        isMusicExpanded={isMusicExpanded}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusicExpanded}
      />
      <MusicPlayer
        hidden={welcomeActive}
        isHomePage={isHomePage}
        isMobileExpanded={isMusicExpanded}
        onMobileExpandedChange={setIsMusicExpanded}
        onPlayingStateChange={setIsMusicPlaying}
      />

      {/* Welcome screen overlay */}
      {welcomeActive && isHomePage && (
        <WelcomeScreen
          onHighlight={setHighlightedRoute}
          onComplete={handleWelcomeComplete}
        />
      )}

      {/* Unsplash attribution as required by their API terms */}
      {attribution && background.val === BackgroundMode.Random && process.env.NEXT_PUBLIC_SHOW_PHOTOGRAPHER_CREDIT === 'true' && (
        <div
          sx={{
            position: "fixed",
            bottom: `${taskbarHeight + 16}px`, // Dynamic positioning based on taskbar height
            right: "16px",
            padding: "8px 12px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 1000,
            opacity: 0.8,
            transition: "opacity 0.3s ease",
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <a
            href={attribution.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "white",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Photo by {attribution.photographerName} on Unsplash
          </a>
        </div>
      )}
    </main>
  );
}
