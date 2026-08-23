import { useSyncExternalStore } from "react";

const DESKTOP_BREAKPOINT = 1024;
const desktopQuery = `(min-width: ${DESKTOP_BREAKPOINT}px)`;

function subscribe(callback: () => void) {
  const mql = window.matchMedia(desktopQuery);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(desktopQuery).matches;
}

function getServerSnapshot() {
  return true;
}

export function useDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
