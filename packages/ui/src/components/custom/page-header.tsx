export interface PageHeaderProps {
  badge?: string;
  description: string;
  title: string;
}

export function PageHeader({ badge, description, title }: PageHeaderProps) {
  return (
    <header className="mb-10">
      {badge && (
        <p className="text-muted-foreground mb-2 text-sm font-medium tracking-wider uppercase">
          {badge}
        </p>
      )}

      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>

      <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-7">
        {description}
      </p>
    </header>
  );
}
