import { useEffect, useState } from "react";

import { fetchMinecraftVersions } from "@/server/functions/minecraft-versions";

interface UseMinecraftVersionsResult {
  error: string | null;
  isLoading: boolean;
  versions: string[];
}

let cachedVersions: string[] | null = null;
let fetchPromise: Promise<string[]> | null = null;

function loadVersions(): Promise<string[]> {
  if (!fetchPromise) {
    fetchPromise = fetchMinecraftVersions()
      .then((result) => {
        cachedVersions = result.versions;
        return result.versions;
      })
      .catch((error) => {
        fetchPromise = null;
        throw error;
      });
  }

  return fetchPromise;
}

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

    let cancelled = false;

    loadVersions()
      .then((v) => {
        if (!cancelled) {
          setVersions(v);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load versions"
          );
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { error, isLoading, versions };
}
