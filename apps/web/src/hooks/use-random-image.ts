import { draw, group } from "radash";
import { useEffect, useState } from "react";

const rawImages = import.meta.glob<string>(
  "/{minecraft,roblox,websites,discord}/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, import: "default", query: "?url" }
);

const imagePaths = Object.keys(rawImages);
const imagesByCategory = group(
  imagePaths,
  (path) => path.split("/")[1] ?? "uncategorized"
);

export function useRandomImage(
  categoryId: string,
  intervalMs = 15_000
): { src: string; isLoaded: boolean; handleLoad: () => void } {
  const [src, setSrc] = useState(() => `/${categoryId}/0.png`);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const selectRandom = () => {
      const pool = imagesByCategory[categoryId] ?? [];
      const selected = draw(pool) ?? `/${categoryId}/0.png`;

      setIsLoaded(false);
      setSrc(selected);

      const delay = intervalMs + Math.random() * 5000;
      return window.setTimeout(selectRandom, delay);
    };

    const timeoutId = selectRandom();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [categoryId, intervalMs]);

  const handleLoad = () => setIsLoaded(true);

  return { handleLoad, isLoaded, src };
}
