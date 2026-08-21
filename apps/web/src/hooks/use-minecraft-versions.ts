import { useEffect, useState } from "react";

import { fetchMinecraftVersions } from "@/server/functions/minecraft-versions";

interface UseMinecraftVersionsResult {
  versions: string[];
  isLoading: boolean;
  error: string | null;
}

// Module-level cache for cross-component deduplication
let cachedVersions: string[] | null = null;
let fetchPromise: Promise<string[]> | null = null;

export function useMinecraftVersions(): UseMinecraftVersionsResult {
  const [versions, setVersions] = useState<string[]>(cachedVersions ?? []);
  const [isLoading, setIsLoading] = useState(cachedVersions === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedVersions) {
      setVersions(cachedVersions);
      setIsLoading(false);
      return;
    }

    // Deduplicate concurrent fetches across components
    if (!fetchPromise) {
      fetchPromise = fetchMinecraftVersions()
        .then((result) => {
          cachedVersions = result.versions;
          return result.versions;
        })
        .catch((err) => {
          fetchPromise = null; // Allow retry on failure
          throw err;
        });
    }

    fetchPromise
      .then((v) => {
        setVersions(v);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load versions"
        );
        setIsLoading(false);
      });
  }, []);

  return { versions, isLoading, error };
}
