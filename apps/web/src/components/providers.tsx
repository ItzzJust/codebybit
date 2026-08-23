import { HotkeysProvider, useHotkeys } from "@tanstack/react-hotkeys";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

function GlobalHotkeys() {
  const navigate = useNavigate();

  useHotkeys([
    {
      callback: () => navigate({ to: "/" }),
      hotkey: "Mod+H",
      options: {
        meta: {
          description: "Navigate to homepage",
          name: "Go Home",
        },
      },
    },
    {
      callback: () => navigate({ to: "/resources/minecraft" }),
      hotkey: "Mod+M",
      options: {
        meta: {
          description: "Navigate to Minecraft resources",
          name: "Go to Minecraft",
        },
      },
    },
  ]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <HotkeysProvider>
      <GlobalHotkeys />
      {children}
    </HotkeysProvider>
  );
}
