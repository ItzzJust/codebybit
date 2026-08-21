import {
  CommandMenu,
  ErrorBoundary,
  MotionProvider,
  Navbar,
  NotFound,
  SidebarProvider,
  Toaster,
  TooltipProvider,
} from "@codebybit/ui";
import { ThemeProvider } from "@lonik/themer";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

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
            <Toaster>
              <TooltipProvider>
                <MotionProvider>
                  <CommandMenu />
                  <Navbar />
                  <ErrorBoundary>
                    <div className="pt-16">{children}</div>
                  </ErrorBoundary>
                </MotionProvider>
              </TooltipProvider>
            </Toaster>
          </SidebarProvider>
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
      <NotFound />
    </main>
  ),
  shellComponent: RootDocument,
});
