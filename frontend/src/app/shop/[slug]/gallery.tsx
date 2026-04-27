"use client";

import { useEffect, useState } from "react";

type GalleryImage = { id: number; src: string; alt: string };

/**
 * Product gallery — uniform 2-column grid (4-up).
 * Click any tile to open the full-screen lightbox with prev/next.
 */
export function ProductGallery({ images, fallbackAlt }: { images: GalleryImage[]; fallbackAlt: string }) {
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  useEffect(() => {
    if (zoomIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomIndex(null);
      if (e.key === "ArrowRight") setZoomIndex((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setZoomIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomIndex, images.length]);

  if (images.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="aspect-[3/4] bg-ink/5" />
        <div className="aspect-[3/4] bg-ink/5" />
        <div className="col-span-2 aspect-[3/4] bg-ink/5" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, i) => {
          const isWide = i % 3 === 2;
          return (
            <button
              key={`${img.id}-${i}`}
              type="button"
              onClick={() => setZoomIndex(i)}
              className={`group relative overflow-hidden bg-bone ${isWide ? "col-span-2 aspect-[3/4]" : "aspect-[3/4]"}`}
              aria-label={`View larger image ${i + 1}`}
            >
              <img
                src={img.src}
                alt={img.alt || fallbackAlt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
          );
        })}
      </div>

      {zoomIndex !== null ? (
        <div
          className="fixed inset-0 z-[80] bg-ink/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomIndex(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setZoomIndex(null); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="w-6 h-6">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => { e.stopPropagation(); setZoomIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)); }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => { e.stopPropagation(); setZoomIndex((i) => (i === null ? null : (i + 1) % images.length)); }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          ) : null}

          <img
            src={images[zoomIndex].src}
            alt={images[zoomIndex].alt || fallbackAlt}
            className="max-w-[92vw] max-h-[88vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-6 inset-x-0 text-center text-bone/70 text-xs tracking-widest">
            {zoomIndex + 1} / {images.length}
          </div>
        </div>
      ) : null}
    </>
  );
}
