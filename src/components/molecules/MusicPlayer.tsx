import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useClickAway, useKey } from "react-use";
import { ThemeUICSSObject } from "theme-ui";
import useMatchTheme from "../../hooks/useMatchTheme";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useTaskbarHeight from "../../hooks/useTaskbarHeight";
import useYouTubePlayer from "../../hooks/useYouTubePlayer";
import { ThemeMode } from "../../themes";
import music, { MusicCategory } from "../../data/music";

const YOUTUBE_CONTAINER_ID = "yt-hidden-player";
const RAIL_WIDTH = 48;
const RAIL_GAP = 8;
const PANEL_WIDTH = 280;

type MusicPlayerProps = {
  hidden?: boolean;
  isHomePage?: boolean;
  isMobileExpanded?: boolean;
  onMobileExpandedChange?: (expanded: boolean) => void;
  onPlayingStateChange?: (playing: boolean) => void;
};

export default function MusicPlayer({ hidden, isHomePage, isMobileExpanded: externalMobileExpanded, onMobileExpandedChange, onPlayingStateChange }: MusicPlayerProps) {
  const isMobile = useInBreakpoint(1);
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);
  const isLiquidGlassTheme = useMatchTheme(ThemeMode.LiquidGlass);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);

  const { state, play, pause, loadVideo, seekTo, setVolume } = useYouTubePlayer(YOUTUBE_CONTAINER_ID);

  const categories = music.filter((c) => c.tracks.length > 0);

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [showSource, setShowSource] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || null;
  const activeTrack = activeCategory?.tracks[activeTrackIndex] || null;

  useClickAway(containerRef, () => {
    if (isExpanded) setIsExpanded(false);
  });

  useKey("Escape", () => {
    if (isExpanded) setIsExpanded(false);
  });

  // Handle track ended — advance to next or loop
  useEffect(() => {
    const handleEnded = () => {
      if (!activeCategory) return;
      const nextIndex = (activeTrackIndex + 1) % activeCategory.tracks.length;
      setActiveTrackIndex(nextIndex);
      loadVideo(activeCategory.tracks[nextIndex].youtubeId);
    };
    window.addEventListener("yt-track-ended", handleEnded);
    return () => window.removeEventListener("yt-track-ended", handleEnded);
  }, [activeCategory, activeTrackIndex, loadVideo]);

  const handleTrackSelect = useCallback(
    (category: MusicCategory, trackIndex: number) => {
      setActiveCategoryId(category.id);
      setActiveTrackIndex(trackIndex);
      loadVideo(category.tracks[trackIndex].youtubeId);
    },
    [loadVideo]
  );

  const handlePrevTrack = useCallback(() => {
    if (!activeCategory) return;
    const prevIndex = activeTrackIndex === 0 ? activeCategory.tracks.length - 1 : activeTrackIndex - 1;
    setActiveTrackIndex(prevIndex);
    loadVideo(activeCategory.tracks[prevIndex].youtubeId);
  }, [activeCategory, activeTrackIndex, loadVideo]);

  const handleNextTrack = useCallback(() => {
    if (!activeCategory) return;
    const nextIndex = (activeTrackIndex + 1) % activeCategory.tracks.length;
    setActiveTrackIndex(nextIndex);
    loadVideo(activeCategory.tracks[nextIndex].youtubeId);
  }, [activeCategory, activeTrackIndex, loadVideo]);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!state.duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      seekTo(ratio * state.duration);
    },
    [state.duration, seekTo]
  );

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // --- Theme-aware glassmorphism ---
  const getGlassStyle = (): ThemeUICSSObject => {
    const base: ThemeUICSSObject = {
      bg: "primary",
      color: "textReverse",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    };

    if (isSoftTheme) return {
      ...base,
      bg: "rgba(226, 227, 240, 0.85)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    };
    if (isClassicTheme) return {
      ...base,
      bg: "background",
      border: "1px solid rgba(0, 0, 0, 0.2)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)",
    };
    if (isTronTheme) return {
      ...base,
      bg: "rgba(0, 29, 35, 0.9)",
      border: "1px solid rgba(40, 142, 159, 0.3)",
      boxShadow: "0 4px 20px rgba(40, 142, 159, 0.3), 0 0 0 1px var(--theme-ui-colors-shadow)",
    };
    if (isLiquidGlassTheme) return {
      ...base,
      bg: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(20px) saturate(1.8)",
      WebkitBackdropFilter: "blur(20px) saturate(1.8)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    };
    if (isCyberpunkTheme) return {
      ...base,
      bg: "rgba(26, 0, 51, 0.9)",
      color: "highlight",
      border: "1px solid var(--theme-ui-colors-highlight)",
      boxShadow: "0 0 20px rgba(255, 0, 128, 0.6), 0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(255, 0, 128, 0.1)",
    };

    // Flat (default)
    return {
      ...base,
      background: "rgba(44, 62, 80, 0.9)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)",
    };
  };

  const glassStyle = getGlassStyle();

  const controlButtonStyle: ThemeUICSSObject = {
    background: "none",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 1,
    borderRadius: "50%",
    transition: "opacity 0.15s ease",
    opacity: 0.8,
    "&:hover": { opacity: 1 },
    "&:disabled": { opacity: 0.3, cursor: "default" },
  };

  const hasAnyTracks = categories.length > 0;
  const [isHovered, setIsHovered] = useState(false);
  const taskbarHeight = useTaskbarHeight();

  // Use lifted state from Layout if provided, otherwise local state
  const [localMobileExpanded, setLocalMobileExpanded] = useState(false);
  const isMobileExpanded = externalMobileExpanded ?? localMobileExpanded;
  const setIsMobileExpanded = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    const newVal = typeof val === "function" ? val(isMobileExpanded) : val;
    if (onMobileExpandedChange) {
      onMobileExpandedChange(newVal);
    } else {
      setLocalMobileExpanded(newVal);
    }
  }, [onMobileExpandedChange, isMobileExpanded]);

  // Report playing state changes to parent
  useEffect(() => {
    onPlayingStateChange?.(state.isPlaying);
  }, [state.isPlaying, onPlayingStateChange]);

  const mobilePlayerRef = useRef<HTMLDivElement>(null);

  useClickAway(mobilePlayerRef, () => {
    if (isMobileExpanded) setIsMobileExpanded(false);
  }, ["mousedown", "touchstart"]);

  // --- Hidden YouTube player (always rendered to prevent removeChild errors) ---
  const youtubeContainer = (
    <div
      id={YOUTUBE_CONTAINER_ID}
      sx={{
        position: "fixed",
        top: "-9999px",
        left: "-9999px",
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );

  // Auto-hide music panel on scroll (mobile only)
  useEffect(() => {
    if (!isMobile || !isMobileExpanded) return;
    const handleScroll = () => {
      setIsMobileExpanded(false);
    };
    // Listen for scroll on any scrollable window body element
    const scrollTargets = document.querySelectorAll("[data-window-body]");
    scrollTargets.forEach((el) => el.addEventListener("scroll", handleScroll, { passive: true }));
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollTargets.forEach((el) => el.removeEventListener("scroll", handleScroll));
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile, isMobileExpanded, setIsMobileExpanded]);

  // --- Mobile music player (dock-anchored panel) ---
  if (isMobile) {
    // Show floating button only on home page (no window open)
    const showFloatingButton = isHomePage && !hidden;

    return (
      <>
        {youtubeContainer}

        {/* Floating music button — home screen only */}
        {showFloatingButton && (
          <motion.button
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            sx={{
              ...glassStyle,
              position: "fixed",
              top: "12px",
              right: "12px",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: activeTrack ? "8px 12px" : "10px",
              borderRadius: activeTrack ? "20px" : "50%",
              cursor: "pointer",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              minWidth: activeTrack ? "auto" : "40px",
              minHeight: "40px",
              justifyContent: "center",
            }}
            aria-label="Toggle music player"
          >
            {state.isPlaying ? (
              <EqualizerIcon />
            ) : (
              <MusicNoteIcon />
            )}
            {activeTrack && (
              <span sx={{
                fontSize: "11px",
                fontWeight: "bold",
                maxWidth: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {activeTrack.title}
              </span>
            )}
          </motion.button>
        )}

        {/* Mobile panel anchored above dock */}
        <AnimatePresence>
          {isMobileExpanded && !hidden && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileExpanded(false)}
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  zIndex: 99,
                }}
              />
              {/* Panel */}
              <motion.div
                ref={mobilePlayerRef}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                sx={{
                  ...glassStyle,
                  position: "fixed",
                  bottom: `${taskbarHeight + 12}px`,
                  left: "12px",
                  right: "12px",
                  maxHeight: "55vh",
                  overflowY: "auto",
                  borderRadius: "16px",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  zIndex: 100,
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.2)", borderRadius: "2px" },
                }}
              >
                {/* Header */}
                <div sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span sx={{ fontSize: 2, fontWeight: "bold" }}>My Soundtrack</span>
                  <button
                    onClick={() => setIsMobileExpanded(false)}
                    sx={{ ...controlButtonStyle, p: "4px", opacity: 0.5, "&:hover": { opacity: 1 } }}
                    aria-label="Close player"
                  >
                    <CloseIcon />
                  </button>
                </div>

                {/* Now Playing */}
                {activeTrack && (
                  <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span sx={{ fontSize: 1, fontWeight: "bold", lineHeight: 1.3 }}>
                        {activeTrack.title}
                      </span>
                      <span sx={{ fontSize: 0, opacity: 0.6 }}>{activeTrack.artist}</span>
                      {activeCategory && (
                        <span sx={{ fontSize: 0, opacity: 0.4, fontStyle: "italic" }}>
                          {activeCategory.label}
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div
                      onClick={handleSeek}
                      sx={{
                        height: "6px",
                        bg: "rgba(255,255,255,0.15)",
                        borderRadius: "3px",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          bg: "highlight",
                          borderRadius: "3px",
                          width: state.duration ? `${(state.currentTime / state.duration) * 100}%` : "0%",
                          transition: "width 0.25s linear",
                        }}
                      />
                    </div>

                    {/* Time */}
                    <div sx={{ display: "flex", justifyContent: "space-between", fontSize: "10px", opacity: 0.5 }}>
                      <span>{formatTime(state.currentTime)}</span>
                      <span>{state.duration ? formatTime(state.duration) : "--:--"}</span>
                    </div>

                    {/* Controls */}
                    <div sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                      <button
                        onClick={handlePrevTrack}
                        sx={controlButtonStyle}
                        disabled={!activeCategory || activeCategory.tracks.length <= 1}
                        aria-label="Previous track"
                      >
                        <PrevIcon />
                      </button>
                      <button
                        onClick={togglePlayPause}
                        sx={{
                          ...controlButtonStyle,
                          bg: "rgba(255,255,255,0.12)",
                          p: 2,
                          opacity: 1,
                          "&:hover": { bg: "rgba(255,255,255,0.2)", opacity: 1 },
                        }}
                        aria-label={state.isPlaying ? "Pause" : "Play"}
                      >
                        {state.isPlaying ? <PauseIcon /> : <PlayIcon />}
                      </button>
                      <button
                        onClick={handleNextTrack}
                        sx={controlButtonStyle}
                        disabled={!activeCategory || activeCategory.tracks.length <= 1}
                        aria-label="Next track"
                      >
                        <NextIcon />
                      </button>
                    </div>

                    {/* Volume */}
                    <div sx={{ display: "flex", alignItems: "center", gap: 2, px: 1 }}>
                      <VolumeIcon muted={state.volume === 0} />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        sx={{
                          flex: 1,
                          height: "4px",
                          appearance: "none",
                          bg: "rgba(255,255,255,0.15)",
                          borderRadius: "2px",
                          outline: "none",
                          "&::-webkit-slider-thumb": {
                            appearance: "none",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            bg: "highlight",
                            cursor: "pointer",
                          },
                          "&::-moz-range-thumb": {
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            bg: "highlight",
                            border: "none",
                            cursor: "pointer",
                          },
                        }}
                        aria-label="Volume"
                      />
                    </div>
                  </div>
                )}

                {/* Categories */}
                {!hasAnyTracks ? (
                  <div sx={{ textAlign: "center", opacity: 0.5, py: 4, fontSize: 1 }}>
                    No tracks added yet.
                  </div>
                ) : (
                  <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {categories.map((category) => {
                      const isCatExpanded = expandedCategoryId === category.id;
                      const isCategoryActive = activeCategoryId === category.id;

                      return (
                        <div key={category.id}>
                          <div
                            onClick={() => setExpandedCategoryId(isCatExpanded ? null : category.id)}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              p: 2,
                              borderRadius: "6px",
                              cursor: "pointer",
                              border: "1px solid",
                              borderColor: isCategoryActive ? "highlight" : "rgba(255,255,255,0.1)",
                              bg: isCategoryActive ? "rgba(255,255,255,0.1)" : "transparent",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <div sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span sx={{ fontSize: 1, fontWeight: "bold" }}>{category.label}</span>
                              <span sx={{ fontSize: 0, opacity: 0.5 }}>
                                {category.tracks.length} track{category.tracks.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            {category.description && (
                              <span sx={{ fontSize: 0, opacity: 0.5, fontStyle: "italic" }}>
                                {category.description}
                              </span>
                            )}
                          </div>

                          {/* Track list */}
                          {isCatExpanded && (
                            <div sx={{ display: "flex", flexDirection: "column", mt: 1, ml: 1 }}>
                              {category.tracks.map((track, index) => {
                                const isActiveTrack = isCategoryActive && activeTrackIndex === index;

                                return (
                                  <div
                                    key={`${category.id}-${index}`}
                                    onClick={() => handleTrackSelect(category, index)}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                      p: "8px",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                      bg: isActiveTrack ? "rgba(255,255,255,0.12)" : "transparent",
                                      transition: "background 0.15s ease",
                                    }}
                                  >
                                    <span sx={{ fontSize: 0, opacity: 0.4, width: "16px", textAlign: "center", flexShrink: 0 }}>
                                      {isActiveTrack && state.isPlaying ? <EqualizerIcon /> : index + 1}
                                    </span>
                                    <div sx={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                                      <span
                                        sx={{
                                          fontSize: 0,
                                          fontWeight: isActiveTrack ? "bold" : "normal",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}
                                      >
                                        {track.title}
                                      </span>
                                      <span sx={{ fontSize: "10px", opacity: 0.5 }}>{track.artist}</span>
                                    </div>
                                    <span
                                      role="link"
                                      title="Open on YouTube"
                                      onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        window.open(`https://www.youtube.com/watch?v=${track.youtubeId}`, "_blank", "noopener");
                                        window.focus();
                                      }}
                                      sx={{
                                        flexShrink: 0,
                                        opacity: 0.3,
                                        cursor: "pointer",
                                        p: "4px",
                                        borderRadius: "4px",
                                        transition: "opacity 0.15s ease",
                                        "&:hover": { opacity: 0.8 },
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <ExternalLinkIcon />
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Error state */}
                {state.error && (
                  <div sx={{ fontSize: 0, color: "red", textAlign: "center", opacity: 0.8 }}>
                    Failed to load track. Try another.
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // --- Desktop music player (rail + panel) ---
  return (
    <>
      {youtubeContainer}

      {/* Centering wrapper — full height, flex center, no transform conflict */}
      <div
        sx={{
          position: "fixed",
          left: "16px",
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
      {/* Rail + Panel container — slides in/out */}
      <motion.div
        ref={containerRef}
        initial={{ x: -80, opacity: 0 }}
        animate={{
          x: hidden ? -80 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeOut", delay: hidden ? 0 : 0.3 }}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: `${RAIL_GAP}px`,
          pointerEvents: hidden ? "none" : "auto",
        }}
      >
        {/* === THE RAIL === */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            ...glassStyle,
            width: `${RAIL_WIDTH}px`,
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
            gap: 2,
            transition: "box-shadow 0.3s ease",
            cursor: !isExpanded ? "pointer" : "default",
          }}
          onClick={() => { if (!isExpanded) setIsExpanded(true); }}
        >
          {/* Music icon */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            sx={{
              ...controlButtonStyle,
              opacity: isExpanded ? 1 : 0.7,
              p: "10px",
              borderRadius: "12px",
              bg: isExpanded ? "rgba(255,255,255,0.15)" : "transparent",
              transition: "all 0.2s ease",
              "&:hover": { opacity: 1, bg: "rgba(255,255,255,0.1)" },
            }}
            aria-label="Toggle music player"
            title="My Soundtrack"
          >
            <MusicNoteIcon />
          </button>

          {/* Expand hint — chevron that shows on hover when panel is closed */}
          {!isExpanded && !activeTrack && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.8 : 0.35 }}
              sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <ChevronRightIcon />
            </motion.div>
          )}

          {/* Playing indicator — only when track active */}
          {activeTrack && (
            <>
              <div sx={{ width: "24px", height: "1px", bg: "rgba(255,255,255,0.15)" }} />

              {/* Mini play/pause on rail */}
              <button
                onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                sx={{
                  ...controlButtonStyle,
                  p: "6px",
                  opacity: 0.7,
                  "&:hover": { opacity: 1 },
                }}
                aria-label={state.isPlaying ? "Pause" : "Play"}
              >
                {state.isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
              </button>

              {/* Tiny equalizer when playing */}
              {state.isPlaying && (
                <div sx={{ opacity: 0.6 }}>
                  <EqualizerIcon />
                </div>
              )}

              {/* Expand chevron when panel is closed */}
              {!isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 0.8 : 0.3 }}
                  sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <ChevronRightIcon />
                </motion.div>
              )}
            </>
          )}

          {/* YouTube logo — bottom of rail */}
          {activeTrack && (
            <>
              <div sx={{ flex: 1 }} />
              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(true); setShowSource(!showSource); }}
                sx={{
                  ...controlButtonStyle,
                  p: "6px",
                  opacity: 0.4,
                  "&:hover": { opacity: 0.8 },
                }}
                title={showSource ? "Hide YouTube source" : "Show YouTube source"}
                aria-label="Toggle YouTube source"
              >
                <YouTubeIcon size={16} />
              </button>
            </>
          )}
        </div>

        {/* Hover tooltip — shows track name or "My Soundtrack" when rail hovered and panel closed */}
        <AnimatePresence>
          {isHovered && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              sx={{
                position: "absolute",
                left: `${RAIL_WIDTH + 8}px`,
                ...glassStyle,
                borderRadius: "8px",
                px: "10px",
                py: "6px",
                whiteSpace: "nowrap",
                fontSize: 0,
                fontWeight: "bold",
                pointerEvents: "none",
              }}
            >
              {activeTrack ? `${activeTrack.title} — ${activeTrack.artist}` : "My Soundtrack"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* === THE EXPANDED PANEL === */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              sx={{
                ...glassStyle,
                width: `${PANEL_WIDTH}px`,
                maxHeight: "70vh",
                overflowY: "auto",
                borderRadius: "12px",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 3,

                // Scrollbar styling
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.2)", borderRadius: "2px" },
              }}
              role="dialog"
              aria-label="Music Player"
            >
              {/* Header */}
              <div sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span sx={{ fontSize: 2, fontWeight: "bold" }}>My Soundtrack</span>
                <button
                  onClick={() => setIsExpanded(false)}
                  sx={{
                    ...controlButtonStyle,
                    p: "4px",
                    opacity: 0.5,
                    "&:hover": { opacity: 1 },
                  }}
                  aria-label="Close player"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* YouTube source reveal */}
              {showSource && activeTrack && (
                <div
                  sx={{
                    borderRadius: "6px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${activeTrack.youtubeId}?autoplay=0&rel=0`}
                    width="100%"
                    height="160"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sx={{ display: "block" }}
                  />
                </div>
              )}

              {/* Now Playing */}
              {activeTrack && (
                <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span sx={{ fontSize: 1, fontWeight: "bold", lineHeight: 1.3 }}>
                      {activeTrack.title}
                    </span>
                    <span sx={{ fontSize: 0, opacity: 0.6 }}>{activeTrack.artist}</span>
                    {activeCategory && (
                      <span sx={{ fontSize: 0, opacity: 0.4, fontStyle: "italic" }}>
                        {activeCategory.label}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div
                    onClick={handleSeek}
                    sx={{
                      height: "4px",
                      bg: "rgba(255,255,255,0.15)",
                      borderRadius: "2px",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": { height: "6px" },
                      transition: "height 0.15s ease",
                    }}
                  >
                    <div
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        bg: "highlight",
                        borderRadius: "2px",
                        width: state.duration ? `${(state.currentTime / state.duration) * 100}%` : "0%",
                        transition: "width 0.25s linear",
                      }}
                    />
                    {state.isBuffering && (
                      <div
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          width: "100%",
                          background: "linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.2) 50%, transparent 75%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.5s infinite",
                        }}
                      />
                    )}
                  </div>

                  {/* Time */}
                  <div sx={{ display: "flex", justifyContent: "space-between", fontSize: "10px", opacity: 0.5 }}>
                    <span>{formatTime(state.currentTime)}</span>
                    <span>{state.duration ? formatTime(state.duration) : "--:--"}</span>
                  </div>

                  {/* Controls */}
                  <div sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                    <button
                      onClick={handlePrevTrack}
                      sx={controlButtonStyle}
                      disabled={!activeCategory || activeCategory.tracks.length <= 1}
                      aria-label="Previous track"
                    >
                      <PrevIcon />
                    </button>
                    <button
                      onClick={togglePlayPause}
                      sx={{
                        ...controlButtonStyle,
                        bg: "rgba(255,255,255,0.12)",
                        p: 2,
                        opacity: 1,
                        "&:hover": { bg: "rgba(255,255,255,0.2)", opacity: 1 },
                      }}
                      aria-label={state.isPlaying ? "Pause" : "Play"}
                    >
                      {state.isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button
                      onClick={handleNextTrack}
                      sx={controlButtonStyle}
                      disabled={!activeCategory || activeCategory.tracks.length <= 1}
                      aria-label="Next track"
                    >
                      <NextIcon />
                    </button>
                  </div>

                  {/* Volume */}
                  <div sx={{ display: "flex", alignItems: "center", gap: 2, px: 1 }}>
                    <VolumeIcon muted={state.volume === 0} />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={state.volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      sx={{
                        flex: 1,
                        height: "4px",
                        appearance: "none",
                        bg: "rgba(255,255,255,0.15)",
                        borderRadius: "2px",
                        outline: "none",
                        "&::-webkit-slider-thumb": {
                          appearance: "none",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          bg: "highlight",
                          cursor: "pointer",
                        },
                        "&::-moz-range-thumb": {
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          bg: "highlight",
                          border: "none",
                          cursor: "pointer",
                        },
                      }}
                      aria-label="Volume"
                    />
                  </div>
                </div>
              )}

              {/* Categories */}
              {!hasAnyTracks ? (
                <div sx={{ textAlign: "center", opacity: 0.5, py: 4, fontSize: 1 }}>
                  No tracks added yet.
                  <br />
                  <span sx={{ fontSize: 0 }}>Add tracks in src/data/music.ts</span>
                </div>
              ) : (
                <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {categories.map((category) => {
                    const isCatExpanded = expandedCategoryId === category.id;
                    const isCategoryActive = activeCategoryId === category.id;

                    return (
                      <div key={category.id}>
                        <div
                          onClick={() => setExpandedCategoryId(isCatExpanded ? null : category.id)}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            p: 2,
                            borderRadius: "6px",
                            cursor: "pointer",
                            border: "1px solid",
                            borderColor: isCategoryActive ? "highlight" : "rgba(255,255,255,0.1)",
                            bg: isCategoryActive ? "rgba(255,255,255,0.1)" : "transparent",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bg: "rgba(255,255,255,0.08)",
                              borderColor: "rgba(255,255,255,0.2)",
                            },
                          }}
                        >
                          <div sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span sx={{ fontSize: 1, fontWeight: "bold" }}>{category.label}</span>
                            <span sx={{ fontSize: 0, opacity: 0.5 }}>
                              {category.tracks.length} track{category.tracks.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                          {category.description && (
                            <span sx={{ fontSize: 0, opacity: 0.5, fontStyle: "italic" }}>
                              {category.description}
                            </span>
                          )}
                        </div>

                        {/* Track list */}
                        {isCatExpanded && (
                          <div sx={{ display: "flex", flexDirection: "column", mt: 1, ml: 1 }}>
                            {category.tracks.map((track, index) => {
                              const isActiveTrack = isCategoryActive && activeTrackIndex === index;

                              return (
                                <div
                                  key={`${category.id}-${index}`}
                                  onClick={() => handleTrackSelect(category, index)}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    p: "6px 8px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    bg: isActiveTrack ? "rgba(255,255,255,0.12)" : "transparent",
                                    transition: "background 0.15s ease",
                                    "&:hover": { bg: "rgba(255,255,255,0.08)" },
                                  }}
                                >
                                  <span sx={{ fontSize: 0, opacity: 0.4, width: "16px", textAlign: "center", flexShrink: 0 }}>
                                    {isActiveTrack && state.isPlaying ? <EqualizerIcon /> : index + 1}
                                  </span>
                                  <div sx={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                                    <span
                                      sx={{
                                        fontSize: 0,
                                        fontWeight: isActiveTrack ? "bold" : "normal",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {track.title}
                                    </span>
                                    <span sx={{ fontSize: "10px", opacity: 0.5 }}>{track.artist}</span>
                                  </div>
                                  <span
                                    role="link"
                                    title="Open on YouTube"
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      window.open(`https://www.youtube.com/watch?v=${track.youtubeId}`, "_blank", "noopener");
                                      window.focus();
                                    }}
                                    sx={{
                                      flexShrink: 0,
                                      opacity: 0,
                                      cursor: "pointer",
                                      p: "4px",
                                      borderRadius: "4px",
                                      transition: "opacity 0.15s ease",
                                      "div:hover > &": { opacity: 0.3 },
                                      "&:hover": { opacity: "0.8 !important" },
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <ExternalLinkIcon />
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Error state */}
              {state.error && (
                <div sx={{ fontSize: 0, color: "red", textAlign: "center", opacity: 0.8 }}>
                  Failed to load track. Try another.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
    </>
  );
}

// --- Icons ---

const ChevronRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

const MusicNoteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

const YouTubeIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.67 31.67 0 0 0 0 12a31.67 31.67 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.67 31.67 0 0 0 24 12a31.67 31.67 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
);

const PlayIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const PrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
  </svg>
);

const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const VolumeIcon = ({ muted }: { muted: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" sx={{ opacity: 0.5, flexShrink: 0 }}>
    {muted ? (
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    ) : (
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    )}
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
  </svg>
);

const EqualizerIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" sx={{ opacity: 0.8 }}>
    <rect x="4" y="10" width="4" height="10" rx="1">
      <animate attributeName="height" values="10;16;10" dur="0.8s" repeatCount="indefinite" />
      <animate attributeName="y" values="10;7;10" dur="0.8s" repeatCount="indefinite" />
    </rect>
    <rect x="10" y="6" width="4" height="14" rx="1">
      <animate attributeName="height" values="14;8;14" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" values="6;10;6" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="16" y="8" width="4" height="12" rx="1">
      <animate attributeName="height" values="12;18;12" dur="0.7s" repeatCount="indefinite" />
      <animate attributeName="y" values="8;4;8" dur="0.7s" repeatCount="indefinite" />
    </rect>
  </svg>
);
