import { Resvg } from "@resvg/resvg-js";
import { createFileRoute } from "@tanstack/react-router";
import satori from "satori";

import { clientIp } from "@/lib/http-guards";
import { rateLimit } from "@/lib/rate-limit";

const SITE_NAME = "CodeByBit";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Google serves static TTF files to legacy user agents and woff2 to modern
// ones. satori's bundled opentype parser can't read woff2, so we use the
// curve UA to get per-weight TTFs. Parsing the stylesheet at runtime keeps
// the URLs from going stale when Google rotates its font files.
const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap";
const FONT_CSS_USER_AGENT = "curl/8.4.0";
const FONT_FETCH_TIMEOUT_MS = 5000;

const OG_RATE_LIMIT = 30;
const OG_RATE_WINDOW_SECONDS = 60;

/** Cached font buffers to avoid re-fetching on every request. */
let cachedRegularFont: ArrayBuffer | null = null;
let cachedBoldFont: ArrayBuffer | null = null;

/** Extract `font-weight → font url` from a `@font-face` stylesheet. */
function parseFontUrls(css: string) {
  const urls: Record<string, string> = {};
  // Google's css2 output lists one `font-weight` line followed by its `src`
  // url per @font-face; pairing them sequentially stays correct across rows.
  const fontFacePattern =
    /font-weight:\s*(?<weight>\d+);?[\s\S]*?url\((?<url>https:\/\/[^)]+\.(?:ttf|woff2))\)/gu;
  for (const match of css.matchAll(fontFacePattern)) {
    const [, weight, url] = match;
    if (weight && url) {
      urls[weight] = url;
    }
  }
  return urls;
}

async function getInterFonts(): Promise<{
  regular: ArrayBuffer;
  bold: ArrayBuffer;
}> {
  if (cachedRegularFont && cachedBoldFont) {
    return { regular: cachedRegularFont, bold: cachedBoldFont };
  }

  const cssResponse = await fetch(FONT_CSS_URL, {
    headers: { "User-Agent": FONT_CSS_USER_AGENT },
    signal: AbortSignal.timeout(FONT_FETCH_TIMEOUT_MS),
  });
  if (!cssResponse.ok) {
    throw new Error(`Failed to fetch Inter stylesheet: ${cssResponse.status}`);
  }

  const css = await cssResponse.text();
  const fontUrls = parseFontUrls(css);

  const fetchFont = async (weight: number): Promise<ArrayBuffer> => {
    const fontUrl = fontUrls[weight];
    if (!fontUrl) {
      throw new Error(`No font URL found for Inter weight ${weight}`);
    }
    const res = await fetch(fontUrl, {
      signal: AbortSignal.timeout(FONT_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch Inter ${weight}: ${res.status}`);
    }
    return res.arrayBuffer();
  };

  const [regular, bold] = await Promise.all([fetchFont(400), fetchFont(700)]);
  cachedRegularFont = regular;
  cachedBoldFont = bold;
  return { regular, bold };
}

/** Escape text for safe display in the OG template */
function escapeText(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Truncate text to fit within a character limit */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1)}…`;
}

interface OgTemplateProps {
  title: string;
  description: string;
}

/**
 * OG image template using satori's object-based JSX.
 * Returns a React-element-like object tree that satori can render to SVG.
 */
function ogTemplate({ title, description }: OgTemplateProps) {
  return {
    key: null,
    type: "div",
    props: {
      children: [
        // Accent gradient bar at top
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: "linear-gradient(90deg, #a855f7, #6366f1)",
            },
          },
        },
        // Main content container
        {
          type: "div",
          props: {
            children: [
              // Brand section
              {
                type: "div",
                props: {
                  children: [
                    {
                      type: "div",
                      props: {
                        children: SITE_NAME,
                        style: {
                          fontSize: 56,
                          fontWeight: 700,
                          color: "#ffffff",
                          fontFamily: "Inter",
                          letterSpacing: -1,
                        },
                      },
                    },
                    {
                      type: "div",
                      props: {
                        children: "Marketplace for Digital Resources",
                        style: {
                          fontSize: 20,
                          color: "#94a3b8",
                          fontFamily: "Inter",
                          marginTop: 4,
                        },
                      },
                    },
                  ],
                  style: {
                    display: "flex",
                    flexDirection: "column",
                  },
                },
              },
              // Spacer
              {
                type: "div",
                props: {
                  style: { height: 48 },
                },
              },
              // Title
              {
                type: "div",
                props: {
                  children: truncate(title, 65),
                  style: {
                    fontSize: 44,
                    fontWeight: 700,
                    color: "#f8fafc",
                    fontFamily: "Inter",
                    lineHeight: 1.2,
                    letterSpacing: -0.5,
                  },
                },
              },
              // Description
              {
                type: "div",
                props: {
                  children: truncate(description, 120),
                  style: {
                    fontSize: 22,
                    color: "#94a3b8",
                    fontFamily: "Inter",
                    marginTop: 16,
                    lineHeight: 1.4,
                  },
                },
              },
              // Spacer
              {
                type: "div",
                props: {
                  style: { flex: 1 },
                },
              },
              // Category pills
              {
                type: "div",
                props: {
                  children: ["Minecraft", "Roblox", "Websites", "Discord"].map(
                    (category) => ({
                      type: "div",
                      props: {
                        children: category,
                        style: {
                          fontSize: 16,
                          color: "#c4b5fd",
                          fontFamily: "Inter",
                          padding: "8px 16px",
                          borderRadius: 9999,
                          border: "1px solid rgba(168, 85, 247, 0.3)",
                          backgroundColor: "rgba(168, 85, 247, 0.1)",
                        },
                      },
                    })
                  ),
                  style: {
                    display: "flex",
                    gap: 12,
                  },
                },
              },
            ],
            style: {
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              padding: 60,
              backgroundColor: "#0f172a",
              backgroundImage:
                "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            },
          },
        },
      ],
      style: {
        display: "flex",
        position: "relative",
        width: OG_WIDTH,
        height: OG_HEIGHT,
        overflow: "hidden",
      },
    },
  };
}

async function generateOgImage(
  title: string,
  description: string
): Promise<Uint8Array> {
  const { regular, bold } = await getInterFonts();

  const svg = await satori(ogTemplate({ title, description }), {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        {
          name: "Inter",
          data: regular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: bold,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: OG_WIDTH,
    },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // satori + resvg are CPU-heavy — protect the endpoint from abuse.
        const allowed = await rateLimit(`og:${clientIp(request)}`, {
          limit: OG_RATE_LIMIT,
          windowSeconds: OG_RATE_WINDOW_SECONDS,
        });
        if (!allowed) {
          return new Response("Too many requests", { status: 429 });
        }

        const url = new URL(request.url);
        const title = url.searchParams.get("title") ?? SITE_NAME;
        const description =
          url.searchParams.get("description") ??
          "The marketplace for Minecraft, Roblox, Discord, and web resources.";

        try {
          const png = await generateOgImage(
            escapeText(title),
            escapeText(description)
          );

          return new Response(Buffer.from(png), {
            status: 200,
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
        } catch (error) {
          console.error("Failed to generate OG image:", error);
          return new Response("Failed to generate OG image", {
            status: 500,
          });
        }
      },
    },
  },
});
