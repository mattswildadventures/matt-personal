# Photo Lightbox with Prev/Next Cycling + Fullscreen Expand

## Context

The gallery lightbox shows a single photo with no way to navigate. Need prev/next arrows to cycle through collection photos, plus a fullscreen expand option in the gallery Window page.

---

## Three Lightbox Contexts

### 1. Rail Panel Inline Lightbox (`PhotoGallery.tsx`)
- **Stays exactly as-is** — overlays within the panel
- **Add:** Prev/next arrows + `"1 / N"` counter
- **Add:** Keyboard ArrowLeft/ArrowRight support

### 2. Gallery Page In-Window Lightbox (`pages/gallery.tsx`)
- **Stays exactly as-is** — overlays within the Window
- **Add:** Prev/next arrows + `"1 / N"` counter
- **Add:** Fullscreen expand button next to the X (close) button — opens fullscreen lightbox
- **Add:** Keyboard ArrowLeft/ArrowRight support

### 3. Gallery Page Fullscreen Lightbox (`pages/gallery.tsx`) — NEW
- Full viewport overlay (`position: fixed`, `zIndex: 200`, covers everything including Window chrome)
- Dark backdrop, centered image, prev/next arrows, counter, title/description/location
- Close button returns to the in-window lightbox (or closes entirely)
- Keyboard: ArrowLeft/Right cycles, Escape closes back to in-window view

---

## Files to Modify

### `src/components/molecules/PhotoGallery.tsx`

**State change:**
- `lightboxPhoto: Photo | null` → `lightboxPhotos: Photo[]` + `lightboxIndex: number`
- `lightboxPhotos` empty = closed, non-empty = open at `lightboxIndex`

**Where photos are set** (click handlers):
- Desktop panel photo grid click → pass `currentCollection.photos` + clicked index
- Mobile sheet photo grid click → same

**InlineLightbox component updates:**
- Arrow buttons: left/right sides, 36px circles, `rgba(255,255,255,0.15)`, hover brightens
- Counter: top-center `"1 / 5"` text, `opacity: 0.6`
- Hide arrows when only 1 photo
- Wrap-around (last→first, first→last)

**Keyboard:**
- Add `useKey("ArrowLeft")` and `useKey("ArrowRight")` — only when lightbox open

### `pages/gallery.tsx`

**State change:**
- `lightboxPhoto: Photo | null` → `lightboxPhotos: Photo[]` + `lightboxIndex: number`
- New: `isFullscreen: boolean` (default false)

**In-window lightbox updates:**
- Same arrows + counter as rail panel
- Add expand button (ArrowsOut icon) next to close button, top-right
- Click expand → sets `isFullscreen = true`

**New fullscreen lightbox:**
- `position: fixed`, `top: 0`, `left: 0`, full viewport, `zIndex: 200`
- Same image display, arrows, counter, title/description/location
- Close button (X) → `isFullscreen = false` (returns to in-window lightbox)
- Escape → `isFullscreen = false`

---

## Arrow UI (shared pattern across all 3)

```
┌──────────────────────────────────┐
│          1 / 5             [⛶][X]│
│                                  │
│  [◄]    [    image    ]    [►]   │
│                                  │
│         Title · Location         │
└──────────────────────────────────┘
```

- Arrows: semi-transparent circles, vertically centered at `left: 16px` / `right: 16px`
- Desktop: 40px arrows. Rail panel: 36px. Mobile: 32px
- Counter: top-center, small white text
- `stopPropagation` on all interactive elements so backdrop click-to-close still works

---

## Verification

- Rail panel → Blue Mountains (2 photos) → click photo → arrows cycle, wraps around
- Rail panel → Bondi Coastal (1 photo) → no arrows shown
- Gallery page → Travel (4 photos) → click photo → arrows cycle in-window
- Gallery page → click expand → fullscreen overlay with same photo + cycling
- Gallery page fullscreen → Escape → returns to in-window lightbox
- Gallery page in-window → Escape → closes lightbox entirely
- Keyboard ArrowLeft/Right works in all 3 contexts
- Mobile sheet → drill in → click photo → arrows cycle at touch size
