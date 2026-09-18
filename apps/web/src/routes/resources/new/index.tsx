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
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  Gamepad2,
  Globe,
  Loader2,
  MessageSquare,
  Plus,
  X,
} from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { discordCategories } from "@/data/discord/categories";
import { minecraftCategories } from "@/data/minecraft/categories";
import { robloxCategories } from "@/data/roblox/categories";
import { websiteCategories } from "@/data/websites/categories";
import { useSession } from "@/lib/auth-client";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/resources/new/")({
  head: () =>
    seo({
      title: "Submit Resource",
      description: "Share your creation with the CodeByBit community.",
      path: "/resources/new",
    }),
  component: ResourceCreatePage,
});

// ---------------------------------------------------------------------------
// Platform definitions
// ---------------------------------------------------------------------------

const platforms = [
  {
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: Boxes,
    id: "minecraft",
    title: "Minecraft",
  },
  {
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: Gamepad2,
    id: "roblox",
    title: "Roblox",
  },
  {
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    icon: Globe,
    id: "websites",
    title: "Websites",
  },
  {
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    icon: MessageSquare,
    id: "discord",
    title: "Discord",
  },
] as const;

type PlatformId = (typeof platforms)[number]["id"];

const categoryMap = {
  minecraft: minecraftCategories,
  roblox: robloxCategories,
  websites: websiteCategories,
  discord: discordCategories,
} as const satisfies Record<
  PlatformId,
  readonly { id: string; title: string; description: string }[]
>;

const platformSections = {
  minecraft: "minecraft",
  roblox: "roblox",
  websites: "websites",
  discord: "discord",
} as const satisfies Record<PlatformId, string>;

// ---------------------------------------------------------------------------
// Tag suggestions
// ---------------------------------------------------------------------------

const TAG_SUGGESTIONS = [
  "official",
  "updated",
  "featured",
  "popular",
  "beginner-friendly",
  "performance",
  "open-source",
  "lightweight",
  "community",
  "experimental",
];

// ---------------------------------------------------------------------------
// Form validation (pure, outside component)
// ---------------------------------------------------------------------------

interface ResourceForm {
  title: string;
  description: string;
  tags: string[];
  tagInput: string;
}

function validateForm(values: ResourceForm) {
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
  return errs;
}

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i <= step ? "bg-primary w-8" : "bg-muted w-4"
          }`}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Platform step
// ---------------------------------------------------------------------------

function PlatformStep({
  platform,
  onSelect,
}: {
  platform: PlatformId | null;
  onSelect: (id: PlatformId) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {platforms.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => {
            onSelect(p.id);
          }}
          className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-200 ${
            platform === p.id
              ? "border-primary bg-primary/5 ring-primary/20 ring-2"
              : "border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-muted/40"
          }`}
        >
          <div
            className={`flex size-11 items-center justify-center rounded-xl ${p.color}`}
          >
            <p.icon className="size-5" />
          </div>
          <div className="flex-1">
            <p className="text-foreground text-sm font-semibold">{p.title}</p>
          </div>
          {platform === p.id && (
            <Check className="text-primary size-5 shrink-0" />
          )}
        </button>
      ))}
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Category step
// ---------------------------------------------------------------------------

function CategoryStep({
  platformId,
  selected,
  onSelect,
}: {
  platformId: PlatformId;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const categories = categoryMap[platformId];

  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => {
            onSelect(cat.id);
          }}
          className={`rounded-2xl border p-5 text-left transition-all duration-200 ${
            selected === cat.id
              ? "border-primary bg-primary/5 ring-primary/20 ring-2"
              : "border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-muted/40"
          }`}
        >
          <p className="text-foreground text-sm font-semibold">{cat.title}</p>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            {cat.description}
          </p>
        </button>
      ))}
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Details form step
// ---------------------------------------------------------------------------

function DetailsForm({
  platformId,
  categoryId,
  userId,
}: {
  platformId: PlatformId;
  categoryId: string;
  userId: string;
}) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [form, setForm] = useState<ResourceForm>({
    title: "",
    description: "",
    tags: [],
    tagInput: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ResourceForm, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only update form state — validation happens on blur and submit
  const updateField = useCallback(
    <K extends keyof ResourceForm>(key: K, value: ResourceForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Validate a single field on blur
  const validateField = useCallback(
    <K extends keyof ResourceForm>(key: K) => {
      setErrors((prev) => {
        const next = validateForm(form);
        // Only keep the error for the field that just blurred
        return { ...prev, [key]: next[key] };
      });
    },
    [form]
  );

  const addTag = useCallback(
    (tag: string) => {
      const normalized = tag.trim().toLowerCase();
      if (
        normalized &&
        !form.tags.includes(normalized) &&
        form.tags.length < 10
      ) {
        updateField("tags", [...form.tags, normalized]);
        updateField("tagInput", "");
      }
    },
    [form.tags, updateField]
  );

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
      const errs = validateForm(form);
      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        return;
      }

      setIsSubmitting(true);

      try {
        const resourceId = `${categoryId}-${form.title
          .toLowerCase()
          .replaceAll(/[^a-z0-9]+/gu, "-")
          .replaceAll(/^-|-$/gu, "")}`;

        const response = await fetch("/api/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: resourceId,
            title: form.title.trim(),
            description: form.description.trim(),
            price: 0,
            section: platformSections[platformId],
            category: categoryId,
            authorId: userId,
            tags: form.tags,
            attributes: {},
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Failed to create resource");
        }

        const resource = await response.json();
        toast.success("Resource created successfully!");
        navigate({
          to: `/resources/${platformId}/$resourceId`,
          params: { resourceId: resource.id },
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, platformId, categoryId, userId, navigate]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <m.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => {
                  updateField("title", e.target.value);
                }}
                onBlur={() => validateField("title")}
                placeholder="My Awesome Resource"
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
                onChange={(e) => {
                  updateField("description", e.target.value);
                }}
                onBlur={() => validateField("description")}
                placeholder="Describe your resource in detail. Markdown is supported."
                rows={6}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Price — greyed out */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-muted-foreground">
                Price (USD)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value="0"
                disabled
                className="text-muted-foreground cursor-not-allowed opacity-60"
              />
              <p className="text-muted-foreground text-xs">
                Free — selling resources is not yet supported.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={form.tagInput}
                  onChange={(e) => {
                    updateField("tagInput", e.target.value);
                  }}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(form.tagInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    addTag(form.tagInput);
                  }}
                  disabled={!form.tagInput.trim()}
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {TAG_SUGGESTIONS.filter(
                  (s) =>
                    !form.tags.includes(s) &&
                    !form.tagInput.toLowerCase().includes(s)
                )
                  .slice(0, 8)
                  .map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        addTag(suggestion);
                      }}
                      className="border-border/60 bg-muted/30 hover:bg-muted/60 text-muted-foreground rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
              </div>

              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          removeTag(tag);
                        }}
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
      </m.div>

      <m.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="flex justify-end gap-3"
      >
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Resource"}
        </Button>
      </m.div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function ResourceCreatePage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { data: session, isPending } = useSession();

  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState<PlatformId | null>(null);
  const [category, setCategory] = useState("");

  const platformTitle = useMemo(
    () => platforms.find((p) => p.id === platform)?.title ?? "",
    [platform]
  );

  useEffect(() => {
    if (!isPending && !session) {
      toast.warning("Sign in required to submit a resource.");
      navigate({ to: "/login" });
    }
  }, [isPending, session, navigate]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  const canAdvance = () => {
    if (step === 0) {
      return platform !== null;
    }
    if (step === 1) {
      return category !== "";
    }
    return true;
  };

  const handleBack = () => {
    if (step === 0) {
      navigate({ to: "/resources" });
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleNext = () => {
    if (step < 2) {
      setStep((s) => s + 1);
    }
  };

  const stepLabels = [
    "Which platform is this resource for?",
    `Choose a category for your ${platformTitle} resource.`,
    "Fill in the details for your resource.",
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <m.div
        initial={reduce ? false : { opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          {step === 0 ? "Back to Resources" : "Back"}
        </button>
      </m.div>

      <m.header
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Submit Resource
          </h1>
          <StepIndicator step={step} total={3} />
        </div>
        <p className="text-muted-foreground text-sm">{stepLabels[step]}</p>
      </m.header>

      {step === 0 && (
        <PlatformStep
          platform={platform}
          onSelect={(id) => {
            setPlatform(id);
            setCategory("");
          }}
        />
      )}

      {step === 1 && platform && (
        <CategoryStep
          platformId={platform}
          selected={category}
          onSelect={setCategory}
        />
      )}

      {step === 2 && platform && category && (
        <DetailsForm
          platformId={platform}
          categoryId={category}
          userId={session.user.id}
        />
      )}

      {step < 2 && (
        <m.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex justify-end"
        >
          <Button onClick={handleNext} disabled={!canAdvance()}>
            Next
            <ArrowRight className="size-4" />
          </Button>
        </m.div>
      )}
    </div>
  );
}
