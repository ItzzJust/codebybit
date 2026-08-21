import { Image } from "@unpic/react";

export interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  href: string;
  images: readonly string[];
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
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover blur-xl"
      />

      <Image
        src={src}
        alt={`${title} category banner`}
        width={400}
        height={300}
        className="relative z-10 h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
      />
    </>
  );
}

export function ResourceCategories({
  categories,
  getRandomImage,
}: ResourceCategoriesProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          Browse Resources
        </h2>

        <p className="text-muted-foreground mt-1 text-sm">
          Select a category to explore available assets.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <a
            key={category.id}
            id={category.id}
            href={category.href}
            className="group border-border/50 bg-muted/30 hover:border-border focus-visible:ring-ring relative flex aspect-4/3 overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
          >
            <CategoryImage
              categoryId={category.id}
              getRandomImage={getRandomImage}
              title={category.title}
            />

            <div className="absolute inset-0 z-20 bg-linear-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

            <div className="absolute inset-0 z-30 flex flex-col justify-end p-5 text-white">
              <h3 className="text-xl font-semibold tracking-wide">
                {category.title}
              </h3>

              <p className="mt-1 text-xs text-white/80 opacity-90">
                {category.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
