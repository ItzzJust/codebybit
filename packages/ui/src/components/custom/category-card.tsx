import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

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
      className="group focus-visible:ring-ring block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <Card className="border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-muted/40 flex h-full min-h-[180px] flex-col overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        <CardHeader className="pb-3">
          <div className="bg-primary/10 text-primary group-hover:bg-primary/20 mb-3 flex size-12 items-center justify-center rounded-xl transition-all duration-300">
            <Icon className="size-5" />
          </div>

          <CardTitle className="text-lg font-semibold">{title}</CardTitle>

          <CardDescription className="mt-1.5 text-sm leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        {badge && (
          <CardContent className="pt-0">
            <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
              {badge}
            </span>
          </CardContent>
        )}

        <CardFooter className="mt-auto pt-2">
          <div className="text-muted-foreground group-hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors duration-200">
            <span>Explore resources</span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
