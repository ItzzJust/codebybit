import { Resvg } from "@resvg/resvg-js";
import { createFileRoute } from "@tanstack/react-router";
import satori from "satori";

const SITE_NAME = "CodeByBit";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/** Cached font buffer to avoid re-fetching on every request */
let cachedFont: ArrayBuffer | null = null;

async function getInterFont(): Promise<ArrayBuffer> {
  if (cachedFont) {
    return cachedFont;
  }

  const fontUrl =
    "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwYZ90OmSqEpJpE.woff";
  const res = await fetch(fontUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch Inter font: ${res.status}`);
  }
  cachedFont = await res.arrayBuffer();
  return cachedFont;
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
  const fontData = await getInterFont();

  // SAFETY: satori accepts JSX-like objects; ogTemplate returns a valid satori input
  const svg = await satori(
    ogTemplate({ title, description }) as unknown as React.ReactElement,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: fontData,
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
