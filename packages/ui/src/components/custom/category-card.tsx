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
    <a
      id={id}
      href={href}
      className="group focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <Card className="border-border/50 bg-muted/30 hover:border-border h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <CardHeader>
          <div className="bg-primary/10 text-primary group-hover:bg-primary/12 group-hover:text-primary mb-2 flex size-11 items-center justify-center rounded-lg transition-colors duration-200">
            <Icon className="size-5" />
          </div>

          <CardTitle>{title}</CardTitle>

          <CardDescription className="mt-1">{description}</CardDescription>
        </CardHeader>

        {badge && (
          <CardContent>
            <span className="text-muted-foreground text-xs">{badge}</span>
          </CardContent>
        )}

        <CardFooter className="mt-auto">
          <div className="text-muted-foreground group-hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors">
            <span>Explore resources</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <ArrowRight className="size-4" />
            </span>
          </div>
        </CardFooter>
      </Card>
    </a>
  );
}
