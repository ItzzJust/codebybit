import { createServerFn } from "@tanstack/react-start";

interface MojangVersionManifest {
  latest: { release: string; snapshot: string };
  versions: {
    id: string;
    type: "release" | "snapshot" | "old_beta" | "old_alpha";
    url: string;
    releaseTime: string;
  }[];
}

const VERSION_MANIFEST_URL =
  "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json";
const CACHE_TTL_MS = 3_600_000;

let cache: { data: string[]; timestamp: number } | null = null;

async function fetchVersions(): Promise<string[]> {
  const response = await fetch(VERSION_MANIFEST_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Minecraft versions: ${response.status} ${response.statusText}`,
    );
  }

  const manifest: MojangVersionManifest = await response.json();

  const releases = manifest.versions.filter((v) => v.type === "release");

  const sorted = [...releases].sort(
    (a, b) =>
      new Date(b.releaseTime).getTime() - new Date(a.releaseTime).getTime(),
  );

  return sorted.map((v) => v.id);
}

function isCacheValid(): boolean {
  if (!cache) {
    return false;
  }
  return Date.now() - cache.timestamp < CACHE_TTL_MS;
}

export const fetchMinecraftVersions = createServerFn({ method: "GET" }).handler(
  async () => {
    if (isCacheValid() && cache) {
      return { lastUpdated: cache.timestamp, versions: cache.data };
    }

    try {
      const versions = await fetchVersions();
      cache = { data: versions, timestamp: Date.now() };
      return { lastUpdated: cache.timestamp, versions };
    } catch (error) {
      if (cache) {
        return { lastUpdated: cache.timestamp, versions: cache.data };
      }

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch Minecraft versions";
      throw new Error(message, { cause: error });
    }
  },
);
