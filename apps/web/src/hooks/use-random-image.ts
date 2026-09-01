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
  const defaultSrc =
    imagesByCategory[categoryId]?.[0] ?? `/${categoryId}/0.png`;
  const [src, setSrc] = useState(defaultSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const selectRandom = () => {
      const pool = imagesByCategory[categoryId] ?? [];
      const selected = draw(pool) ?? defaultSrc;

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
