import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { ThemeUICSSObject } from "theme-ui";
import useMatchTheme from "../../hooks/useMatchTheme";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useTaskbarHeight from "../../hooks/useTaskbarHeight";
import { ThemeMode } from "../../themes";
import photos, { Photo, PhotoCollection, countPhotos, getAllPhotos } from "../../data/photos";

const RAIL_WIDTH = 48;
const RAIL_GAP = 8;
const PANEL_WIDTH = 380;

type PhotoGalleryProps = {
  hidden?: boolean;
  isHomePage?: boolean;
  isMobileExpanded?: boolean;
  onMobileExpandedChange?: (expanded: boolean) => void;
};

export default function PhotoGallery({
  hidden,
  isHomePage,
  isMobileExpanded: externalMobileExpanded,
  onMobileExpandedChange,
}: PhotoGalleryProps) {
  const router = useRouter();
  const isMobile = useInBreakpoint(1);
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);
  const isLiquidGlassTheme = useMatchTheme(ThemeMode.LiquidGlass);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);

  const collections = photos;

  const [isExpanded, setIsExpanded] = useState(false);
  // Navigation stack for drilling into sub-collections
  const [navStack, setNavStack] = useState<PhotoCollection[]>([]);
  const [lightboxPhotos, setLightboxPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const lightboxOpen = lightboxPhotos.length > 0;
  const lightboxPhoto = lightboxOpen ? lightboxPhotos[lightboxIndex] : null;

  const openLightbox = useCallback((photos: Photo[], index: number) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
  }, []);
  const closeLightbox = useCallback(() => {
    setLightboxPhotos([]);
    setLightboxIndex(0);
  }, []);
  const lightboxPrev = useCallback(() => setLightboxIndex((i) => (i - 1 + lightboxPhotos.length) % lightboxPhotos.length), [lightboxPhotos.length]);
  const lightboxNext = useCallback(() => setLightboxIndex((i) => (i + 1) % lightboxPhotos.length), [lightboxPhotos.length]);

  // Current view: top-level collections or a drilled-into collection
  const currentCollection = navStack.length > 0 ? navStack[navStack.length - 1] : null;

  const containerRef = useRef<HTMLDivElement>(null);

  useClickAway(containerRef, () => {
    if (isExpanded) setIsExpanded(false);
  });

  // Keyboard: Escape cascades (lightbox → back → close panel), arrows cycle photos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) {
          closeLightbox();
        } else if (navStack.length > 0) {
          setNavStack((prev) => prev.slice(0, -1));
        } else if (isExpanded) {
          setIsExpanded(false);
        }
      } else if (lightboxOpen && lightboxPhotos.length > 1) {
        if (e.key === "ArrowLeft") lightboxPrev();
        else if (e.key === "ArrowRight") lightboxNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, lightboxPhotos.length, lightboxPrev, lightboxNext, navStack.length, isExpanded]);

  const handleDrillIn = useCallback((collection: PhotoCollection) => {
    setNavStack((prev) => [...prev, collection]);
    closeLightbox();
  }, []);

  const handleBack = useCallback(() => {
    setNavStack((prev) => prev.slice(0, -1));
    closeLightbox();
  }, []);

  const handlePopOut = useCallback(() => {
    const collectionId = currentCollection?.id;
    if (collectionId) {
      router.push(`/gallery?collection=${collectionId}`);
    } else {
      router.push("/gallery");
    }
    setIsExpanded(false);
  }, [currentCollection, router]);

  // --- Theme-aware glassmorphism (matches MusicPlayer exactly) ---
  const getGlassStyle = (): ThemeUICSSObject => {
    const base: ThemeUICSSObject = {
      bg: "primary",
      color: "textReverse",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    };

    if (isSoftTheme)
      return {
        ...base,
        bg: "rgba(226, 227, 240, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      };
    if (isClassicTheme)
      return {
        ...base,
        bg: "background",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)",
      };
    if (isTronTheme)
      return {
        ...base,
        bg: "rgba(0, 29, 35, 0.9)",
        border: "1px solid rgba(40, 142, 159, 0.3)",
        boxShadow: "0 4px 20px rgba(40, 142, 159, 0.3), 0 0 0 1px var(--theme-ui-colors-shadow)",
      };
    if (isLiquidGlassTheme)
      return {
        ...base,
        bg: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(20px) saturate(1.8)",
        WebkitBackdropFilter: "blur(20px) saturate(1.8)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      };
    if (isCyberpunkTheme)
      return {
        ...base,
        bg: "rgba(26, 0, 51, 0.9)",
        color: "highlight",
        border: "1px solid var(--theme-ui-colors-highlight)",
        boxShadow: "0 0 20px rgba(255, 0, 128, 0.6), 0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(255, 0, 128, 0.1)",
      };

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

  const [isHovered, setIsHovered] = useState(false);
  const taskbarHeight = useTaskbarHeight();

  // Use lifted state from Layout if provided, otherwise local state
  const [localMobileExpanded, setLocalMobileExpanded] = useState(false);
  const isMobileExpanded = externalMobileExpanded ?? localMobileExpanded;
  const setIsMobileExpanded = useCallback(
    (val: boolean | ((prev: boolean) => boolean)) => {
      const newVal = typeof val === "function" ? val(isMobileExpanded) : val;
      if (onMobileExpandedChange) {
        onMobileExpandedChange(newVal);
      } else {
        setLocalMobileExpanded(newVal);
      }
    },
    [onMobileExpandedChange, isMobileExpanded]
  );

  const mobilePlayerRef = useRef<HTMLDivElement>(null);

  useClickAway(
    mobilePlayerRef,
    () => {
      if (isMobileExpanded) setIsMobileExpanded(false);
    },
    ["mousedown", "touchstart"]
  );

  // Auto-hide gallery panel on scroll (mobile only)
  useEffect(() => {
    if (!isMobile || !isMobileExpanded) return;
    const handleScroll = () => setIsMobileExpanded(false);
    const scrollTargets = document.querySelectorAll("[data-window-body]");
    scrollTargets.forEach((el) => el.addEventListener("scroll", handleScroll, { passive: true }));
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollTargets.forEach((el) => el.removeEventListener("scroll", handleScroll));
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile, isMobileExpanded, setIsMobileExpanded]);

  // --- Fan/Stack Cascade Component ---
  const FanStack = ({
    collection,
    onClick,
  }: {
    collection: PhotoCollection;
    onClick: () => void;
  }) => {
    const [isStackHovered, setIsStackHovered] = useState(false);
    // Use cover images from sub-collections or direct photos for the stack
    const stackImages = collection.collections
      ? collection.collections.slice(0, 4).map((c) => ({ id: c.id, src: c.coverUrl, alt: c.label }))
      : (collection.photos ?? []).slice(0, 4).map((p) => ({ id: p.id, src: p.thumbnailUrl || p.imageUrl, alt: p.title }));
    const cardCount = stackImages.length;
    const totalCount = countPhotos(collection);

    const getRestStyle = (index: number, total: number) => {
      const offset = total - 1 - index;
      return { rotate: offset * -1, x: offset * -1, y: offset * -1, scale: 1 };
    };

    const getFanStyle = (index: number, total: number) => {
      if (total === 1) return { rotate: 0, x: 0, y: -4, scale: 1.02 };
      const spread = total <= 3 ? 5 : 4;
      const centerOffset = (total - 1) / 2;
      const normalised = index - centerOffset;
      return {
        rotate: normalised * spread,
        x: normalised * 8,
        y: -4 - Math.abs(normalised) * 2,
        scale: 1.02,
      };
    };

    return (
      <div
        onClick={onClick}
        onMouseEnter={() => setIsStackHovered(true)}
        onMouseLeave={() => setIsStackHovered(false)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          p: 2,
          borderRadius: "8px",
          transition: "background 0.2s ease",
          "&:hover": { bg: "rgba(255,255,255,0.08)" },
        }}
      >
        <div sx={{ position: "relative", width: "120px", height: "80px" }}>
          {stackImages.map((img, index) => {
            const style = isStackHovered ? getFanStyle(index, cardCount) : getRestStyle(index, cardCount);
            return (
              <motion.div
                key={img.id}
                animate={{ rotate: style.rotate, x: style.x, y: style.y, scale: style.scale }}
                transition={{
                  type: "spring",
                  stiffness: isStackHovered ? 350 : 400,
                  damping: isStackHovered ? 20 : 40,
                }}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "120px",
                  height: "80px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  transformOrigin: "center bottom",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </motion.div>
            );
          })}
          {/* Top cover always on top */}
          <motion.div
            animate={{
              rotate: isStackHovered && cardCount > 0 ? getFanStyle(cardCount - 1, cardCount).rotate : 0,
              x: isStackHovered && cardCount > 0 ? getFanStyle(cardCount - 1, cardCount).x : 0,
              y: isStackHovered && cardCount > 0 ? getFanStyle(cardCount - 1, cardCount).y : 0,
              scale: isStackHovered ? 1.02 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: isStackHovered ? 350 : 400,
              damping: isStackHovered ? 20 : 40,
            }}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "120px",
              height: "80px",
              borderRadius: "6px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              zIndex: cardCount + 1,
              transformOrigin: "center bottom",
            }}
          >
            <img
              src={collection.coverUrl}
              alt={collection.label}
              loading="lazy"
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </motion.div>
        </div>

        <div sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <span sx={{ fontSize: 1, fontWeight: "bold", textAlign: "center" }}>{collection.label}</span>
          <span sx={{ fontSize: 0, opacity: 0.5 }}>
            {collection.collections
              ? `${collection.collections.length} collection${collection.collections.length !== 1 ? "s" : ""}`
              : `${totalCount} photo${totalCount !== 1 ? "s" : ""}`}
          </span>
        </div>
      </div>
    );
  };

  // --- Panel content (shared between desktop and mobile detail) ---
  const PanelContent = ({ itemsToShow }: { itemsToShow: PhotoCollection[] }) => (
    <motion.div
      key={currentCollection?.id ?? "root"}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      {/* Sub-collections as fan stacks */}
      {itemsToShow.map((col) => (
        <FanStack key={col.id} collection={col} onClick={() => handleDrillIn(col)} />
      ))}

      {/* Direct photos in current collection */}
      {currentCollection?.photos && currentCollection.photos.length > 0 && (
        <div sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {currentCollection.photos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(currentCollection.photos!, idx)}
              sx={{
                borderRadius: "6px",
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.2s ease",
                aspectRatio: "4/3",
                "&:hover": { border: "1px solid rgba(255,255,255,0.3)", transform: "scale(1.02)" },
              }}
            >
              <img
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  // Determine what to show in the panel
  const getDisplayItems = (): PhotoCollection[] => {
    if (!currentCollection) return collections;
    return currentCollection.collections ?? [];
  };

  // --- Inline Lightbox ---
  const InlineLightbox = () => {
    if (!lightboxPhoto) return null;
    const showArrows = lightboxPhotos.length > 1;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => closeLightbox()}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: "rgba(0,0,0,0.85)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          zIndex: 10,
          borderRadius: "12px",
          cursor: "pointer",
        }}
      >
        {/* Counter */}
        {showArrows && (
          <div
            sx={{ position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)", color: "white", fontSize: 0, opacity: 0.6, zIndex: 2 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {lightboxIndex + 1} / {lightboxPhotos.length}
          </div>
        )}

        {/* Prev arrow */}
        {showArrows && (
          <button
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); lightboxPrev(); }}
            sx={{
              position: "absolute",
              left: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "none",
              bg: "rgba(255,255,255,0.15)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              transition: "background 0.15s ease",
              "&:hover": { bg: "rgba(255,255,255,0.3)" },
            }}
            aria-label="Previous photo"
          >
            <NavArrowLeftIcon />
          </button>
        )}

        {/* Next arrow */}
        {showArrows && (
          <button
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); lightboxNext(); }}
            sx={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "none",
              bg: "rgba(255,255,255,0.15)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              transition: "background 0.15s ease",
              "&:hover": { bg: "rgba(255,255,255,0.3)" },
            }}
            aria-label="Next photo"
          >
            <NavArrowRightIcon />
          </button>
        )}

        <motion.img
          key={lightboxPhoto.id}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          src={lightboxPhoto.imageUrl}
          alt={lightboxPhoto.title}
          sx={{
            maxWidth: "100%",
            maxHeight: "70%",
            objectFit: "contain",
            borderRadius: "6px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        />
        <div sx={{ mt: 2, textAlign: "center", color: "white" }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <div sx={{ fontSize: 1, fontWeight: "bold" }}>{lightboxPhoto.title}</div>
          {lightboxPhoto.description && <div sx={{ fontSize: 0, opacity: 0.7, mt: 1 }}>{lightboxPhoto.description}</div>}
          {lightboxPhoto.location && <div sx={{ fontSize: 0, opacity: 0.5, mt: 1 }}>{lightboxPhoto.location}</div>}
        </div>
      </motion.div>
    );
  };

  // --- Mobile gallery (dock-anchored panel) ---
  if (isMobile) {
    return (
      <AnimatePresence>
        {isMobileExpanded && !hidden && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileExpanded(false)}
              sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.2)", zIndex: 99 }}
            />
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
                overflowX: "hidden",
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
              {/* Header with breadcrumb */}
              <div sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
                  {navStack.length > 0 && (
                    <button
                      onClick={handleBack}
                      sx={{ ...controlButtonStyle, p: "4px", flexShrink: 0, "&:hover": { opacity: 1, bg: "rgba(255,255,255,0.1)" } }}
                      aria-label="Back"
                    >
                      <ChevronLeftIcon />
                    </button>
                  )}
                  <span sx={{ fontSize: 2, fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {currentCollection?.label ?? "Photo Gallery"}
                  </span>
                </div>
                <div sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                  {currentCollection && (
                    <button
                      onClick={handlePopOut}
                      sx={{ ...controlButtonStyle, p: "4px", opacity: 0.5, "&:hover": { opacity: 1 } }}
                      aria-label="Open in window"
                    >
                      <ArrowsOutIcon />
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobileExpanded(false)}
                    sx={{ ...controlButtonStyle, p: "4px", opacity: 0.5, "&:hover": { opacity: 1 } }}
                    aria-label="Close gallery"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              {currentCollection?.description && (
                <span sx={{ fontSize: 0, opacity: 0.5, fontStyle: "italic" }}>{currentCollection.description}</span>
              )}

              {/* Show sub-collections as horizontal carousel at top level, grid when drilled in */}
              {!currentCollection ? (
                <div
                  sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
                    pb: 2,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollSnapType: "x mandatory",
                  }}
                >
                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      onClick={() => handleDrillIn(collection)}
                      sx={{
                        flexShrink: 0,
                        scrollSnapAlign: "start",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        sx={{
                          width: "100px",
                          height: "70px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.15)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        }}
                      >
                        <img
                          src={collection.coverUrl}
                          alt={collection.label}
                          loading="lazy"
                          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>
                      <span sx={{ fontSize: 0, fontWeight: "bold", textAlign: "center" }}>{collection.label}</span>
                      <span sx={{ fontSize: "10px", opacity: 0.5 }}>{countPhotos(collection)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Sub-collections */}
                  {currentCollection.collections && currentCollection.collections.length > 0 && (
                    <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {currentCollection.collections.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => handleDrillIn(sub)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            borderRadius: "6px",
                            cursor: "pointer",
                            border: "1px solid rgba(255,255,255,0.1)",
                            transition: "all 0.2s ease",
                            "&:hover": { bg: "rgba(255,255,255,0.08)" },
                          }}
                        >
                          <div sx={{ width: 48, height: 36, borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                            <img
                              src={sub.coverUrl}
                              alt={sub.label}
                              loading="lazy"
                              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                          </div>
                          <div sx={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                            <span sx={{ fontSize: 1, fontWeight: "bold" }}>{sub.label}</span>
                            <span sx={{ fontSize: "10px", opacity: 0.5 }}>{countPhotos(sub)} photos</span>
                          </div>
                          <ChevronRightIcon />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Direct photos */}
                  {currentCollection.photos && currentCollection.photos.length > 0 && (
                    <div sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                      {currentCollection.photos.map((photo, idx) => (
                        <div
                          key={photo.id}
                          onClick={() => openLightbox(currentCollection.photos!, idx)}
                          sx={{
                            borderRadius: "4px",
                            overflow: "hidden",
                            cursor: "pointer",
                            aspectRatio: "4/3",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          <img
                            src={photo.thumbnailUrl || photo.imageUrl}
                            alt={photo.title}
                            loading="lazy"
                            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Mobile lightbox */}
              <AnimatePresence>
                {lightboxOpen && lightboxPhoto && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => closeLightbox()}
                    sx={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bg: "rgba(0,0,0,0.9)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 3,
                      zIndex: 200,
                    }}
                  >
                    {/* Close button */}
                    <button
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); closeLightbox(); }}
                      sx={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        border: "none",
                        bg: "rgba(255,255,255,0.2)",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 3,
                        transition: "background 0.15s ease",
                        "&:hover": { bg: "rgba(255,255,255,0.35)" },
                      }}
                      aria-label="Close lightbox"
                    >
                      <CloseIcon />
                    </button>

                    {/* Counter */}
                    {lightboxPhotos.length > 1 && (
                      <div
                        sx={{ position: "absolute", top: "22px", left: "50%", transform: "translateX(-50%)", color: "white", fontSize: 0, opacity: 0.6, zIndex: 2 }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        {lightboxIndex + 1} / {lightboxPhotos.length}
                      </div>
                    )}

                    {/* Prev arrow */}
                    {lightboxPhotos.length > 1 && (
                      <button
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); lightboxPrev(); }}
                        sx={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          border: "none",
                          bg: "rgba(255,255,255,0.2)",
                          color: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 2,
                          transition: "background 0.15s ease",
                          "&:hover": { bg: "rgba(255,255,255,0.35)" },
                        }}
                        aria-label="Previous photo"
                      >
                        <NavArrowLeftIcon />
                      </button>
                    )}

                    {/* Next arrow */}
                    {lightboxPhotos.length > 1 && (
                      <button
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); lightboxNext(); }}
                        sx={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          border: "none",
                          bg: "rgba(255,255,255,0.2)",
                          color: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 2,
                          transition: "background 0.15s ease",
                          "&:hover": { bg: "rgba(255,255,255,0.35)" },
                        }}
                        aria-label="Next photo"
                      >
                        <NavArrowRightIcon />
                      </button>
                    )}

                    <img
                      src={lightboxPhoto.imageUrl}
                      alt={lightboxPhoto.title}
                      sx={{ maxWidth: "calc(100% - 80px)", maxHeight: "70vh", objectFit: "contain", borderRadius: "6px" }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                    <div sx={{ mt: 2, textAlign: "center", color: "white" }}>
                      <div sx={{ fontSize: 1, fontWeight: "bold" }}>{lightboxPhoto.title}</div>
                      {lightboxPhoto.description && <div sx={{ fontSize: 0, opacity: 0.7, mt: 1 }}>{lightboxPhoto.description}</div>}
                      {lightboxPhoto.location && <div sx={{ fontSize: 0, opacity: 0.5, mt: 1 }}>{lightboxPhoto.location}</div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // --- Desktop gallery (rail + panel) ---
  return (
    <>
      <div
        sx={{
          position: "fixed",
          right: "16px",
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        <motion.div
          ref={containerRef}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: hidden ? 80 : 0, opacity: hidden ? 0 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: hidden ? 0 : 0.3 }}
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
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
              aria-label="Toggle photo gallery"
              title="Photo Gallery"
            >
              <ImagesIcon />
            </button>

            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.8 : 0.35 }}
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ChevronLeftIcon />
              </motion.div>
            )}
          </div>

          {/* Hover tooltip — LEFT of rail */}
          <AnimatePresence>
            {isHovered && !isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                sx={{
                  position: "absolute",
                  right: `${RAIL_WIDTH + 8}px`,
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
                Photo Gallery
              </motion.div>
            )}
          </AnimatePresence>

          {/* === THE EXPANDED PANEL === */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                sx={{
                  ...glassStyle,
                  width: `${PANEL_WIDTH}px`,
                  maxHeight: "70vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                  borderRadius: "12px",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  position: "relative",
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.2)", borderRadius: "2px" },
                }}
                role="dialog"
                aria-label="Photo Gallery"
              >
                {/* Header with breadcrumb navigation */}
                <div sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
                    {navStack.length > 0 && (
                      <button
                        onClick={handleBack}
                        sx={{
                          ...controlButtonStyle,
                          p: "6px",
                          borderRadius: "6px",
                          flexShrink: 0,
                          "&:hover": { opacity: 1, bg: "rgba(255,255,255,0.1)" },
                        }}
                        aria-label="Back"
                      >
                        <ChevronLeftIcon />
                      </button>
                    )}
                    <span sx={{ fontSize: 2, fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {currentCollection?.label ?? "Photo Gallery"}
                    </span>
                  </div>
                  <div sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                    {currentCollection && (
                      <button
                        onClick={handlePopOut}
                        sx={{
                          ...controlButtonStyle,
                          p: "6px",
                          borderRadius: "6px",
                          opacity: 0.5,
                          "&:hover": { opacity: 1, bg: "rgba(255,255,255,0.1)" },
                        }}
                        aria-label="Pop out to window"
                        title="Open in window"
                      >
                        <ArrowsOutIcon />
                      </button>
                    )}
                    <button
                      onClick={() => setIsExpanded(false)}
                      sx={{ ...controlButtonStyle, p: "4px", opacity: 0.5, "&:hover": { opacity: 1 } }}
                      aria-label="Close gallery"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>

                {currentCollection?.description && (
                  <span sx={{ fontSize: 0, opacity: 0.5, fontStyle: "italic" }}>{currentCollection.description}</span>
                )}

                {/* View transitions */}
                <AnimatePresence exitBeforeEnter>
                  <PanelContent key={currentCollection?.id ?? "root"} itemsToShow={getDisplayItems()} />
                </AnimatePresence>

                {/* Inline lightbox overlay */}
                <AnimatePresence>{lightboxOpen && <InlineLightbox />}</AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

// --- Icons ---

const ChevronLeftIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" sx={{ opacity: 0.4 }}>
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

const ImagesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
    <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM184,200H40V88H184Zm32-32H200V88a16,16,0,0,0-16-16H72V56H216ZM160,116a12,12,0,1,1-12-12A12,12,0,0,1,160,116Zm-16,52H56a8,8,0,0,1-6.65-12.44l24-36a8,8,0,0,1,13.3,0L98.42,137.1l18.24-27.37a8,8,0,0,1,13.34.34l24,40A8,8,0,0,1,147.15,160Z" />
  </svg>
);

const ArrowsOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
    <path d="M216,48V88a8,8,0,0,1-16,0V67.31l-42.34,42.35a8,8,0,0,1-11.32-11.32L188.69,56H168a8,8,0,0,1,0-16h40A8,8,0,0,1,216,48ZM98.34,146.34,56,188.69V168a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H88a8,8,0,0,0,0-16H67.31l42.35-42.34a8,8,0,0,0-11.32-11.32Z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const NavArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const NavArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);
