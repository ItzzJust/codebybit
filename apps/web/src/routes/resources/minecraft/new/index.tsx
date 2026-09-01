import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Textarea,
} from "@codebybit/ui";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useCallback, useState } from "react";

import { minecraftCategories } from "@/data/minecraft/categories";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/resources/minecraft/new")({
  head: () =>
    seo({
      title: "Submit Resource",
      description: "Submit a new Minecraft resource to CodeByBit",
      path: "/resources/minecraft/new",
    }),
  component: ResourceCreatePage,
});

interface ResourceForm {
  title: string;
  description: string;
  price: string;
  section: string;
  tags: string[];
  tagInput: string;
}

function ResourceCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ResourceForm>({
    title: "",
    description: "",
    price: "0",
    section: "plugins",
    tags: [],
    tagInput: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ResourceForm, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = useCallback(
    (values: ResourceForm): Partial<Record<keyof ResourceForm, string>> => {
      const errs: Partial<Record<keyof ResourceForm, string>> = {};
      if (!values.title.trim()) {
        errs.title = "Title is required";
      }
      if (values.title.length > 100) {
        errs.title = "Title must be under 100 characters";
      }
      if (!values.description.trim()) {
        errs.description = "Description is required";
      }
      if (values.description.length < 10) {
        errs.description = "Description must be at least 10 characters";
      }
      if (!values.section) {
        errs.section = "Section is required";
      }
      const price = Number(values.price);
      if (Number.isNaN(price) || price < 0) {
        errs.price = "Price must be a non-negative number";
      }
      return errs;
    },
    []
  );

  const updateField = useCallback(
    <K extends keyof ResourceForm>(key: K, value: ResourceForm[K]) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        setErrors(validate(next));
        return next;
      });
    },
    [validate]
  );

  const addTag = useCallback(() => {
    const tag = form.tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
      updateField("tags", [...form.tags, tag]);
      updateField("tagInput", "");
    }
  }, [form.tagInput, form.tags, updateField]);

  const removeTag = useCallback(
    (tag: string) => {
      updateField(
        "tags",
        form.tags.filter((t) => t !== tag)
      );
    },
    [form.tags, updateField]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errs = validate(form);
      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const resourceId = `${form.section}-${form.title
          .toLowerCase()
          .replaceAll(/[^a-z0-9]+/gu, "-")
          .replaceAll(/^-|-$/g, "")}`;

        const response = await fetch("/api/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: resourceId,
            title: form.title.trim(),
            description: form.description.trim(),
            price: Number(form.price) || 0,
            section: form.section,
            authorId: "anonymous",
            tags: form.tags,
            attributes: {},
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Failed to create resource");
        }

        const resource = await response.json();
        navigate({
          to: "/resources/minecraft/resource/plugin/$resourceId",
          params: {
            resourceId: resource.id.replace(`${resource.section}-`, ""),
          },
        });
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, validate, navigate]
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Link
        to="/resources/minecraft"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Resources
      </Link>

      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Submit Resource
        </h1>
        <p className="text-muted-foreground text-sm">
          Share your Minecraft resource with the community.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            {submitError}
          </div>
        )}

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="My Awesome Plugin"
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your resource in detail. Markdown is supported."
                rows={6}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  aria-invalid={!!errors.price}
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <select
                  id="section"
                  value={form.section}
                  onChange={(e) => updateField("section", e.target.value)}
                  className="border-border bg-background text-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  aria-invalid={!!errors.section}
                >
                  {minecraftCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
                {errors.section && (
                  <p className="text-xs text-red-500">{errors.section}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={form.tagInput}
                  onChange={(e) => updateField("tagInput", e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addTag}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-muted ml-0.5 rounded-full p-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/resources/minecraft" })}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Resource"}
          </Button>
        </div>
      </form>
    </div>
  );
}
