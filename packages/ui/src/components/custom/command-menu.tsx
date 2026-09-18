"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@codebybit/ui/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import {
  BlocksIcon,
  GlobeIcon,
  HomeIcon,
  LayersIcon,
  MessageCircleIcon,
  PaletteIcon,
  PickaxeIcon,
} from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

interface CommandItemDef {
  icon: ReactNode;
  label: string;
  to: string;
  shortcut?: string;
}

const NAV_ITEMS: readonly CommandItemDef[] = [
  {
    icon: <HomeIcon className="size-4" />,
    label: "Home",
    shortcut: "H",
    to: "/",
  },
  {
    icon: <PickaxeIcon className="size-4" />,
    label: "Minecraft Resources",
    shortcut: "M",
    to: "/resources/minecraft",
  },
  {
    icon: <BlocksIcon className="size-4" />,
    label: "Roblox Resources",
    shortcut: "R",
    to: "/resources/roblox",
  },
  {
    icon: <GlobeIcon className="size-4" />,
    label: "Websites Resources",
    shortcut: "W",
    to: "/resources/websites",
  },
  {
    icon: <MessageCircleIcon className="size-4" />,
    label: "Discord Resources",
    shortcut: "D",
    to: "/resources/discord",
  },
];

const RESOURCE_CATEGORIES: readonly CommandItemDef[] = [
  {
    icon: <LayersIcon className="size-4" />,
    label: "All Resources",
    to: "/resources",
  },
  {
    icon: <PaletteIcon className="size-4" />,
    label: "Credits",
    to: "/credits",
  },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runAction = useCallback(
    (to: string) => {
      setOpen(false);
      navigate({ to });
    },
    [navigate]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.to}
              value={item.label}
              onSelect={() => runAction(item.to)}
            >
              {item.icon}
              <span>{item.label}</span>
              <CommandShortcut>{item.shortcut}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Quick Links">
          {RESOURCE_CATEGORIES.map((item) => (
            <CommandItem
              key={item.to}
              value={item.label}
              onSelect={() => runAction(item.to)}
            >
              {item.icon}
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
