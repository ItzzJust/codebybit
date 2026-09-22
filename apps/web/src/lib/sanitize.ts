import sanitizeHtml from "sanitize-html";

/**
 * Strip all raw HTML from user-authored markdown.
 *
 * `@tanstack/markdown` injects raw `html` / `inlineHtml` nodes via
 * `dangerouslySetInnerHTML`, so any un-sanitized HTML in a description would
 * render as live HTML — a stored XSS vector. Markdown syntax doesn't need raw
 * HTML, so we remove every tag while preserving the text content and entities.
 */
export function sanitizeDescription(text: string): string {
  return sanitizeHtml(text, {
    allowedAttributes: {},
    allowedTags: [],
  });
}
