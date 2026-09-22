import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { Readable } from "node:stream";
import { createGzip } from "node:zlib";

import serverEntry from "./dist/server/server.js";

const dir = import.meta.dirname;
const CLIENT_DIR = path.join(dir, "dist", "client");
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

/** Static file extensions that benefit from gzip compression. */
const COMPRESSIBLE_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".svg",
  ".woff",
  ".woff2",
]);

/** Path prefix for content-hashed build assets — safe to cache immutably. */
const HASHED_ASSET_PREFIX = "/assets/";

const SECURITY_HEADERS = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function acceptsGzip(headers) {
  return (headers["accept-encoding"] ?? "").includes("gzip");
}

function isCompressible(pathname) {
  return COMPRESSIBLE_EXTENSIONS.has(path.extname(pathname));
}

function cacheControlFor(pathname) {
  if (pathname.endsWith(".html")) {
    return "no-cache";
  }
  if (pathname.startsWith(HASHED_ASSET_PREFIX)) {
    return "public, max-age=31536000, immutable";
  }
  return "public, max-age=86400";
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function serveStatic(pathname, req, res) {
  const filePath = path.normalize(path.join(CLIENT_DIR, pathname));
  if (!filePath.startsWith(CLIENT_DIR)) {
    res.writeHead(403, SECURITY_HEADERS);
    res.end("Forbidden");
    return true;
  }

  try {
    const info = await stat(filePath);
    if (info.isFile()) {
      const ext = path.extname(filePath);
      const gzip = isCompressible(pathname) && acceptsGzip(req.headers);
      const headers = {
        ...SECURITY_HEADERS,
        "Cache-Control": cacheControlFor(pathname),
        "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
      };
      if (gzip) {
        headers["Content-Encoding"] = "gzip";
        headers["Vary"] = "Accept-Encoding";
      }

      res.writeHead(200, headers);
      if (req.method === "HEAD") {
        res.end();
        return true;
      }

      const stream = createReadStream(filePath);
      if (gzip) {
        stream.pipe(createGzip()).pipe(res);
      } else {
        stream.pipe(res);
      }
      return true;
    }
  } catch {
    // Not a static file — fall through to the server handler.
  }

  return false;
}

const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const server = createServer(async (req, res) => {
  const url = new URL(
    req.url ?? "/",
    `http://${req.headers.host ?? "localhost"}`
  );

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400, SECURITY_HEADERS);
    res.end("Bad Request");
    return;
  }

  // Serve static assets for GET/HEAD.
  if (req.method === "GET" || req.method === "HEAD") {
    const served = await serveStatic(
      pathname === "/" ? "/index.html" : pathname,
      req,
      res
    );
    if (served) {
      return;
    }
  }

  // Read the request body only when one is expected (avoids buffering GETs).
  const body = METHODS_WITH_BODY.has(req.method)
    ? await readBody(req)
    : Buffer.alloc(0);

  try {
    const response = await serverEntry.fetch(
      new Request(url, {
        body: body.length > 0 ? body : undefined,
        headers: req.headers,
        method: req.method,
      })
    );

    const headers = {
      ...Object.fromEntries(response.headers),
      ...SECURITY_HEADERS,
    };

    if (req.method === "HEAD") {
      res.writeHead(response.status, headers);
      res.end();
      return;
    }

    const contentType = response.headers.get("content-type") ?? "";
    const gzip =
      response.body !== null &&
      acceptsGzip(req.headers) &&
      /^(?:text\/|application\/(?:json|javascript|xml))/u.test(contentType);

    if (gzip) {
      delete headers["content-length"];
      headers["Content-Encoding"] = "gzip";
      headers["Vary"] = "Accept-Encoding";
      res.writeHead(response.status, headers);
      Readable.fromWeb(response.body).pipe(createGzip()).pipe(res);
    } else if (response.body) {
      res.writeHead(response.status, headers);
      Readable.fromWeb(response.body).pipe(res);
    } else {
      res.writeHead(response.status, headers);
      res.end();
    }
  } catch (error) {
    console.error("[server] request failed:", error);
    res.writeHead(500, SECURITY_HEADERS);
    res.end("Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`CodeByBit server listening on http://${HOST}:${PORT}`);
});
