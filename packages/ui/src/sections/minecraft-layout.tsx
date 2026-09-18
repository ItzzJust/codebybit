import { SlidersHorizontal } from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";

export interface MinecraftLayoutProps {
  /** Current pathname from the router */
  pathname: string;
  /** The child content to render in the main area */
  children: React.ReactNode;
  /** The sidebar content (FilterSidebar) */
  sidebar: React.ReactNode;
}

// Known subcategory paths that should show the sidebar
const SUBCATEGORY_PATHS = [
  "/resources/minecraft/builds",
  "/resources/minecraft/configs",
  "/resources/minecraft/graphics-textures",
  "/resources/minecraft/models",
  "/resources/minecraft/mods",
  "/resources/minecraft/other",
  "/resources/minecraft/plugins",
  "/resources/minecraft/server-jars",
  "/resources/minecraft/setups",
  "/resources/minecraft/skripts",
];

export function MinecraftLayout({
  pathname,
  children,
  sidebar,
}: MinecraftLayoutProps) {
  const isOverview = pathname === "/resources/minecraft";
  const isSubcategory = SUBCATEGORY_PATHS.includes(pathname);
  const isNewPage = pathname === "/resources/minecraft/new";
  const hideSidebar = isOverview || isNewPage;

  const showSidebar = !hideSidebar && !isSubcategory;

  return (
    <SidebarProvider className="min-h-[calc(100vh-4rem)]">
      {/* Desktop sidebar — hidden on mobile */}
      {showSidebar && (
        <Sidebar className="top-16 hidden h-[calc(100vh-4rem)] md:flex">
          <SidebarContent className="gap-2 py-2">{sidebar}</SidebarContent>
        </Sidebar>
      )}

      <SidebarInset className="min-w-0 flex-1">
        {showSidebar && (
          <header className="border-border flex h-12 items-center border-b px-4">
            <div className="hidden md:block">
              <SidebarTrigger />
            </div>
          </header>
        )}

        <div className="mx-auto max-w-7xl min-w-0">
          <main className="min-w-0">{children}</main>
        </div>
      </SidebarInset>

      {/* Mobile filter drawer — floating button + bottom sheet */}
      {showSidebar && (
        <div className="fixed right-4 bottom-4 z-40 md:hidden">
          <Drawer>
            <DrawerTrigger
              render={
                <Button
                  size="lg"
                  nativeButton={false}
                  className="bg-primary text-primary-foreground gap-2 rounded-full px-5 shadow-lg"
                  aria-label="Open filters"
                />
              }
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </DrawerTrigger>

            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader className="border-border/40 shrink-0 border-b pb-4 text-left">
                <DrawerTitle className="text-base font-semibold">
                  Filters
                </DrawerTitle>
              </DrawerHeader>
              <div className="overflow-y-auto p-4">{sidebar}</div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </SidebarProvider>
  );
}
