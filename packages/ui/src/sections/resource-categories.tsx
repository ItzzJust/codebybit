import { TiltCard } from "@codebybit/ui/components/motion/tilt-card";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

export interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  href: string;
}

export interface ResourceCategoriesProps {
  categories: readonly ResourceCategory[];
  /** Called with (categoryId) to pick a random image URL */
  getRandomImage: (categoryId: string) => string;
}

function CategoryImage({
  categoryId,
  getRandomImage,
  title,
}: {
  categoryId: string;
  getRandomImage: (id: string) => string;
  title: string;
}) {
  const src = getRandomImage(categoryId);

  return (
    <Image
      src={src}
      alt={`${title} category banner`}
      width={400}
      height={300}
      className="relative z-10 h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
    />
  );
}

export function ResourceCategories({
  categories,
  getRandomImage,
}: ResourceCategoriesProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10 text-center">
        <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Browse Resources
        </h2>
        <p className="text-muted-foreground mt-2 text-base">
          Select a category to explore available assets.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <TiltCard
            key={category.id}
            max={8}
            glare={false}
            className="hover:shadow-xl"
          >
            <Link
              id={category.id}
              to={category.href}
              className="group border-border/50 bg-muted/30 hover:border-primary/30 focus-visible:ring-ring relative flex aspect-[4/3] overflow-hidden rounded-2xl border transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none"
            >
              <CategoryImage
                categoryId={category.id}
                getRandomImage={getRandomImage}
                title={category.title}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 z-20 bg-linear-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

              {/* Content */}
              <div className="absolute inset-0 z-30 flex flex-col justify-end p-5">
                <h3 className="text-xl font-semibold tracking-wide text-white">
                  {category.title}
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  {category.description}
                </p>

                {/* Hover indicator */}
                <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-white/90 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <span>Explore</span>
                  <svg
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
