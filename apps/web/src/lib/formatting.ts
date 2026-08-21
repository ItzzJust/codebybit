export function formatPrice(price: number): string {
  if (price === 0) {
    return "Free";
  }
  return `$${price.toFixed(2)}`;
}

export function formatDownloads(downloads: number): string {
  if (downloads >= 1_000_000) {
    return `${(downloads / 1_000_000).toFixed(1)}M`;
  }
  if (downloads >= 1000) {
    return `${(downloads / 1000).toFixed(1)}k`;
  }
  return String(downloads);
}
