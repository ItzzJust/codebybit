export interface PageHeaderProps {
  badge?: string;
  description: string;
  title: string;
}

export function PageHeader({ badge, description, title }: PageHeaderProps) {
  return (
    <header className="mb-12 text-center">
      {badge && (
        <div className="bg-primary/10 text-primary mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase">
          {badge}
        </div>
      )}

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>

      <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
        {description}
      </p>
    </header>
  );
}
