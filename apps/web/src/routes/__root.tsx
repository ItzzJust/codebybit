import {
  CommandMenu,
  ErrorBoundary,
  MotionProvider,
  Navbar,
  NotFound,
  SidebarProvider,
  TooltipProvider,
} from "@codebybit/ui";
import { ThemeProvider } from "@lonik/themer";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

import { Providers } from "@/components/providers";
import { rootSeo } from "@/lib/seo";

import appCss from "../styles.css?url";

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <TooltipProvider>
              <MotionProvider>
                <Providers>
                  <CommandMenu />
                  <Navbar />
                  <ErrorBoundary>
                    <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
                      {children}
                    </div>
                  </ErrorBoundary>
                </Providers>
              </MotionProvider>
            </TooltipProvider>
          </SidebarProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "bg-popover text-popover-foreground border-border",
            }}
          />
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  head: () => {
    const base = rootSeo();
    return {
      ...base,
      links: [
        ...base.links,
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <NotFound
        browseHref="/resources"
        browseLabel="Browse Resources"
        description="The page you're looking for doesn't exist or has been moved. Try browsing our resources instead."
        homeHref="/"
        homeLabel="Back to Home"
        title="Page not found"
      />
    </main>
  ),
  shellComponent: RootDocument,
});
