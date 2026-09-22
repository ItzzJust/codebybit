import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export interface CategoryCardProps {
  badge?: string;
  description: string;
  href: string;
  icon: LucideIcon;
  id: string;
  title: string;
}

export function CategoryCard({
  badge,
  description,
  href,
  icon: Icon,
  id,
  title,
}: CategoryCardProps) {
  return (
    <Link
      id={id}
      to={href}
      className="group/card focus-visible:ring-ring block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="border-border/40 bg-card hover:border-primary/30 flex h-full min-h-[160px] flex-col overflow-hidden rounded-2xl border transition-colors duration-300">
        <div className="relative flex flex-1 flex-col gap-2.5 p-4">
          {/* Icon */}
          <div className="bg-primary/10 text-primary group-hover/card:bg-primary group-hover/card:text-primary-foreground flex size-10 items-center justify-center rounded-lg transition-colors duration-300">
            <Icon className="size-5" />
          </div>

          {/* Text */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground text-base font-semibold">
                {title}
              </h3>
              {badge && (
                <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Footer */}
          <div className="border-border/40 group-hover/card:border-primary/20 mt-auto border-t pt-2.5 transition-colors">
            <div className="text-muted-foreground group-hover/card:text-primary flex items-center gap-1.5 text-sm font-medium transition-colors">
              <span>Explore</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
