export interface ResourcePageLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared page layout for resource listing pages (Roblox, Discord, Websites, etc.).
 * Provides consistent vertical rhythm. Centering is handled by the root layout.
 */
export function ResourcePageLayout({ children }: ResourcePageLayoutProps) {
  return <main className="py-12 sm:py-16 lg:py-20">{children}</main>;
}
