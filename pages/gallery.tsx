import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Flex } from "theme-ui";
import Window from "../src/components/molecules/Window";
import Layout from "../src/components/pages/Layout";
import useInBreakpoint from "../src/hooks/useInBreakpoint";
import photos, { Photo, PhotoCollection, countPhotos, findCollection, getAllPhotos } from "../src/data/photos";
import { AnimatePresence, motion } from "framer-motion";

export default function Gallery(): JSX.Element {
  const { query } = useRouter();
  const isMobile = useInBreakpoint(1);
  const [activeCollection, setActiveCollection] = useState<PhotoCollection | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Handle ?collection= query param (searches entire tree)
  useEffect(() => {
    const collectionId = query.collection as string | undefined;
    if (collectionId) {
      const found = findCollection(photos, collectionId);
      if (found) {
        setActiveCollection(found);
        // Auto-expand parent path
        const newExpanded = new Set<string>();
        const expandParents = (collections: PhotoCollection[], targetId: string): boolean => {
          for (const c of collections) {
            if (c.id === targetId) return true;
            if (c.collections && expandParents(c.collections, targetId)) {
              newExpanded.add(c.id);
              return true;
            }
          }
          return false;
        };
        expandParents(photos, collectionId);
        setExpandedIds(newExpanded);
      }
    }
  }, [query.collection]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Recursive sidebar item renderer
  const SidebarItem = ({ collection, depth = 0 }: { collection: PhotoCollection; depth?: number }) => {
    const isActive = activeCollection?.id === collection.id;
    const hasSubs = !!collection.collections?.length;
    const isOpen = expandedIds.has(collection.id);

    return (
      <>
        <div
          onClick={() => {
            setActiveCollection(collection);
            setLightboxPhoto(null);
            if (hasSubs) toggleExpanded(collection.id);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: "6px 10px",
            pl: `${10 + depth * 16}px`,
            borderRadius: "6px",
            cursor: "pointer",
            bg: isActive ? "rgba(255,255,255,0.12)" : "transparent",
            transition: "background 0.15s ease",
            "&:hover": { bg: "rgba(255,255,255,0.08)" },
          }}
        >
          {hasSubs && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
              sx={{
                flexShrink: 0,
                opacity: 0.4,
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
              }}
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          )}
          {!hasSubs && <div sx={{ width: "10px", flexShrink: 0 }} />}
          <div
            sx={{
              width: 28,
              height: 20,
              borderRadius: "3px",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={collection.coverUrl}
              alt=""
              loading="lazy"
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <div sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span
              sx={{
                fontSize: 0,
                fontWeight: isActive ? "bold" : "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {collection.label}
            </span>
            <span sx={{ fontSize: "10px", opacity: 0.4 }}>
              {countPhotos(collection)}
            </span>
          </div>
        </div>
        {/* Render sub-collections if expanded */}
        {hasSubs && isOpen && collection.collections!.map((sub) => (
          <SidebarItem key={sub.id} collection={sub} depth={depth + 1} />
        ))}
      </>
    );
  };

  // Determine photos to show: direct photos + optionally all nested
  const displayPhotos: Photo[] = activeCollection
    ? activeCollection.photos && activeCollection.photos.length > 0
      ? activeCollection.photos
      : getAllPhotos(activeCollection)
    : [];

  return (
    <Window title="Photo Gallery">
      <Flex
        sx={{
          flex: 1,
          minHeight: 0,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Desktop sidebar — tree navigation */}
        {!isMobile && (
          <div
            sx={{
              minWidth: 200,
              maxWidth: 220,
              overflow: "auto",
              p: 2,
              borderRight: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <div
              sx={{
                fontSize: "10px",
                fontWeight: "bold",
                opacity: 0.4,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                mb: 1,
                px: "10px",
                pt: 1,
              }}
            >
              Collections
            </div>
            {photos.map((collection) => (
              <SidebarItem key={collection.id} collection={collection} />
            ))}
          </div>
        )}

        {/* Mobile dropdown */}
        {isMobile && (
          <div sx={{ p: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <select
              value={activeCollection?.id || ""}
              onChange={(e) => {
                const found = findCollection(photos, e.target.value);
                setActiveCollection(found);
                setLightboxPhoto(null);
              }}
              sx={{
                width: "100%",
                p: "8px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.15)",
                bg: "rgba(255,255,255,0.08)",
                color: "inherit",
                fontSize: 1,
                appearance: "none",
                cursor: "pointer",
              }}
            >
              <option value="">All Collections</option>
              {photos.map((c) => (
                <optgroup key={c.id} label={c.label}>
                  {c.collections ? (
                    c.collections.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.label} ({countPhotos(sub)})
                      </option>
                    ))
                  ) : (
                    <option value={c.id}>{c.label} ({countPhotos(c)})</option>
                  )}
                </optgroup>
              ))}
            </select>
          </div>
        )}

        {/* Main photo grid area */}
        <div
          sx={{ flex: 1, overflow: "auto", p: 3, position: "relative" }}
          data-window-body
        >
          {activeCollection ? (
            <>
              {/* Collection header */}
              <div sx={{ mb: 3 }}>
                <h2 sx={{ fontSize: 3, fontWeight: "bold", m: 0, mb: 1 }}>
                  {activeCollection.label}
                </h2>
                {activeCollection.description && (
                  <p sx={{ fontSize: 1, opacity: 0.6, m: 0 }}>{activeCollection.description}</p>
                )}
              </div>

              {/* Sub-collection cards if this collection has children */}
              {activeCollection.collections && activeCollection.collections.length > 0 && (
                <div
                  sx={{
                    display: "grid",
                    gridTemplateColumns: ["1fr 1fr", "1fr 1fr 1fr", "1fr 1fr 1fr"],
                    gap: "12px",
                    mb: 3,
                  }}
                >
                  {activeCollection.collections.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setActiveCollection(sub);
                        setLightboxPhoto(null);
                        setExpandedIds((prev) => { const next = new Set(prev); next.add(activeCollection.id); return next; });
                      }}
                      sx={{
                        borderRadius: "10px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: "1px solid rgba(255,255,255,0.08)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          border: "1px solid rgba(255,255,255,0.2)",
                          transform: "scale(1.02)",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                        },
                      }}
                    >
                      <div sx={{ aspectRatio: "16/9", overflow: "hidden" }}>
                        <img
                          src={sub.coverUrl}
                          alt={sub.label}
                          loading="lazy"
                          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>
                      <div sx={{ p: "10px 12px" }}>
                        <div sx={{ fontSize: 1, fontWeight: "bold" }}>{sub.label}</div>
                        {sub.description && (
                          <div sx={{ fontSize: 0, opacity: 0.5, mt: "2px" }}>{sub.description}</div>
                        )}
                        <div sx={{ fontSize: "10px", opacity: 0.4, mt: "2px" }}>
                          {countPhotos(sub)} photo{countPhotos(sub) !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Photo grid */}
              {displayPhotos.length > 0 && (
                <div
                  sx={{
                    display: "grid",
                    gridTemplateColumns: ["1fr 1fr", "1fr 1fr 1fr", "1fr 1fr 1fr", "repeat(4, 1fr)"],
                    gap: "12px",
                  }}
                >
                  {displayPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setLightboxPhoto(photo)}
                      sx={{
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        aspectRatio: "4/3",
                        border: "1px solid rgba(255,255,255,0.08)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          border: "1px solid rgba(255,255,255,0.2)",
                          transform: "scale(1.02)",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                        },
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
          ) : (
            /* All collections overview */
            <div
              sx={{
                display: "grid",
                gridTemplateColumns: ["1fr", "1fr 1fr", "1fr 1fr 1fr"],
                gap: "16px",
              }}
            >
              {photos.map((collection) => (
                <div
                  key={collection.id}
                  onClick={() => {
                    setActiveCollection(collection);
                    toggleExpanded(collection.id);
                  }}
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      border: "1px solid rgba(255,255,255,0.2)",
                      transform: "scale(1.02)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <div sx={{ aspectRatio: "16/9", overflow: "hidden" }}>
                    <img
                      src={collection.coverUrl}
                      alt={collection.label}
                      loading="lazy"
                      sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <div sx={{ p: "12px 16px" }}>
                    <div sx={{ fontSize: 1, fontWeight: "bold" }}>{collection.label}</div>
                    {collection.description && (
                      <div sx={{ fontSize: 0, opacity: 0.5, mt: 1 }}>{collection.description}</div>
                    )}
                    <div sx={{ fontSize: "10px", opacity: 0.4, mt: 1 }}>
                      {countPhotos(collection)} photo{countPhotos(collection) !== 1 ? "s" : ""}
                      {collection.collections && ` · ${collection.collections.length} sub-collections`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lightbox modal overlay */}
          <AnimatePresence>
            {lightboxPhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxPhoto(null)}
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
                  p: 4,
                  zIndex: 10,
                  cursor: "pointer",
                }}
              >
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  src={lightboxPhoto.imageUrl}
                  alt={lightboxPhoto.title}
                  sx={{
                    maxWidth: "90%",
                    maxHeight: "75%",
                    objectFit: "contain",
                    borderRadius: "8px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                  }}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
                <div
                  sx={{ mt: 3, textAlign: "center", color: "white" }}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <div sx={{ fontSize: 2, fontWeight: "bold" }}>{lightboxPhoto.title}</div>
                  {lightboxPhoto.description && (
                    <div sx={{ fontSize: 1, opacity: 0.7, mt: 1 }}>{lightboxPhoto.description}</div>
                  )}
                  {lightboxPhoto.location && (
                    <div sx={{ fontSize: 0, opacity: 0.5, mt: 1 }}>{lightboxPhoto.location}</div>
                  )}
                </div>
                <button
                  onClick={() => setLightboxPhoto(null)}
                  sx={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "white",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.15s ease",
                    "&:hover": { background: "rgba(255,255,255,0.25)" },
                  }}
                  aria-label="Close lightbox"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Flex>
    </Window>
  );
}

Gallery.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;
