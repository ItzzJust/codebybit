import { useEffect, useState } from "react";

const rawImages = import.meta.glob<string>(
  "/public/{minecraft,roblox,websites,discord}/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, import: "default", query: "?url" }
);

const imagePaths = Object.keys(rawImages).map((path) =>
  // Vite resolves public-dir globs to "/public/..." URLs, but public files are
  // served at the root, so strip the prefix for URLs that work in both dev and
  // production (dist/client/public does not exist; images live at dist/client/).
  path.replace(/^\/public(?=\/)/u, "")
);

// Group images by category (replaces radash `group`)
const imagesByCategory: Record<string, string[]> = {};
for (const path of imagePaths) {
  // Path format: /minecraft/0.png → category = "minecraft"
  const category = path.split("/")[1] ?? "uncategorized";
  if (!imagesByCategory[category]) {
    imagesByCategory[category] = [];
  }
  imagesByCategory[category].push(path);
}

// Pick a random item from an array (replaces radash `draw`)
function pickRandom<T>(arr: readonly T[]): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useRandomImage(categoryId: string, intervalMs = 15_000) {
  const defaultSrc =
    imagesByCategory[categoryId]?.[0] ?? `/${categoryId}/0.png`;
  const [src, setSrc] = useState(defaultSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reduced-motion users get a static image — no rotation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const selectRandom = () => {
      const pool = imagesByCategory[categoryId] ?? [];
      const selected = pickRandom(pool) ?? defaultSrc;

      setIsLoaded(false);
      setSrc(selected);

      // Self-reference is fine here — it only runs once the timeout fires.
      const delay = intervalMs + Math.random() * 5000;
      timeoutId = window.setTimeout(selectRandom, delay);
    };

    // Pause rotation while the tab is hidden to save CPU/battery.
    const handleVisibility = () => {
      window.clearTimeout(timeoutId);
      if (document.visibilityState === "visible") {
        selectRandom();
      }
    };

    selectRandom();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [categoryId, intervalMs, defaultSrc]);

  const handleLoad = () => setIsLoaded(true);

  return { handleLoad, isLoaded, src };
}
