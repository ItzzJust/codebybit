import { useEffect, useState } from "react";

const rawImages = import.meta.glob<string>(
  "/public/{minecraft,roblox,websites,discord}/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, import: "default", query: "?url" }
);

const imagePaths = Object.keys(rawImages);

// Group images by category (replaces radash `group`)
const imagesByCategory: Record<string, string[]> = {};
for (const path of imagePaths) {
  // Path format: /public/minecraft/0.png → category = "minecraft"
  const category = path.split("/")[2] ?? "uncategorized";
  if (!imagesByCategory[category]) {
    imagesByCategory[category] = [];
  }
  imagesByCategory[category].push(path);
}

// Pick a random item from an array (replaces radash `draw`)
function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {return undefined;}
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useRandomImage(
  categoryId: string,
  intervalMs = 15_000
): { src: string; isLoaded: boolean; handleLoad: () => void } {
  const defaultSrc =
    imagesByCategory[categoryId]?.[0] ?? `/${categoryId}/0.png`;
  const [src, setSrc] = useState(defaultSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const selectRandom = () => {
      const pool = imagesByCategory[categoryId] ?? [];
      const selected = pickRandom(pool) ?? defaultSrc;

      setIsLoaded(false);
      setSrc(selected);

      const delay = intervalMs + Math.random() * 5000;
      timeoutId = window.setTimeout(selectRandom, delay);
    };

    selectRandom();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [categoryId, intervalMs, defaultSrc]);

  const handleLoad = () => setIsLoaded(true);

  return { handleLoad, isLoaded, src };
}
