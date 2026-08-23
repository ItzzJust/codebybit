import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

export interface ResourceHeroLayoutProps {
  /** Platform icon component */
  icon: LucideIcon;
  /** Platform title (e.g. "Minecraft", "Roblox") */
  title: string;
  /** Number of categories */
  categoryCount: number;
  /** Platform description */
  description: string;
  /** Array of 3 image paths for the decorative thumbnail strip */
  images: readonly string[];
  /** Category cards to render below the hero */
  children: ReactNode;
}

export function ResourceHeroLayout({
  icon: Icon,
  title,
  categoryCount,
  description,
  images,
  children,
}: ResourceHeroLayoutProps) {
  const reduce = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleImageClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null
        ? images.length - 1
        : (prev - 1 + images.length) % images.length
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? 0 : (prev + 1) % images.length
    );
  }, [images.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleClose, goToPrev, goToNext]);

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link
                to="/resources"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="size-4" />
                Resources
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
                <Icon className="size-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {title}
                </h1>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {categoryCount} categories
                </p>
              </div>
            </div>

            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-base">
              {description}
            </p>
          </div>

          {/* Decorative thumbnail strip */}
          <div className="hidden lg:flex lg:gap-3">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleImageClick(i)}
                className="bg-muted/60 border-border/40 hover:ring-primary/30 h-24 w-24 cursor-pointer overflow-hidden rounded-2xl border transition-all duration-200 hover:scale-105 hover:ring-2"
              >
                <img
                  src={src}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-border/60 h-px" />

      {/* Category cards */}
      <section className="py-8 sm:py-10">
        <h2 className="text-muted-foreground mb-6 text-xs font-medium tracking-wide uppercase">
          Browse by category
        </h2>

        <m.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {children}
        </m.div>
      </section>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          {/* Close */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 transition-colors hover:text-white"
            aria-label="Close"
          >
            <X className="size-8" />
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute left-4 text-white/80 transition-colors hover:text-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-10" />
          </button>

          {/* Image */}
          <img
            src={images[selectedIndex]}
            alt="Preview"
            className="max-h-[80vh] max-w-[85vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 text-white/80 transition-colors hover:text-white"
            aria-label="Next image"
          >
            <ChevronRight className="size-10" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 text-sm text-white/60">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </main>
  );
}
