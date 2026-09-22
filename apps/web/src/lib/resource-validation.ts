import * as v from "valibot";

import type { CreateResourceInput } from "@/lib/resources";
import { sanitizeDescription } from "@/lib/sanitize";
import { SECTION_LABELS } from "@/types/resource";

export type SanitizedResourceInput = Omit<CreateResourceInput, "authorId">;

export type UpdateResourceInput = Partial<Omit<SanitizedResourceInput, "id">>;

export type ValidationResult =
  | { ok: true; value: SanitizedResourceInput }
  | { ok: false; error: string };

export type UpdateValidationResult =
  | { ok: true; value: UpdateResourceInput }
  | { ok: false; error: string };

const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,119}$/u;

/** Any value that can appear in a JSON request body. */
type JsonValue =
  | boolean
  | null
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 20_000;
const MAX_CATEGORY_LENGTH = 60;
const MAX_PRICE = 1_000_000;
const MAX_TAGS = 10;
const MAX_TAG_LENGTH = 30;
const MAX_ATTRIBUTE_KEYS = 20;
const MAX_ATTRIBUTE_KEY_LENGTH = 50;
const MAX_ATTRIBUTE_VALUES = 20;
const MAX_ATTRIBUTE_VALUE_LENGTH = 60;

const sectionSchema = v.pipe(
  v.string(),
  v.minLength(1),
  v.check((section) => section in SECTION_LABELS, "Unknown section")
);

const tagSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1),
  v.maxLength(MAX_TAG_LENGTH)
);

const attributesSchema = v.pipe(
  v.record(
    v.pipe(
      v.string(),
      v.minLength(1),
      v.maxLength(MAX_ATTRIBUTE_KEY_LENGTH)
    ),
    v.pipe(
      v.array(v.pipe(v.string(), v.maxLength(MAX_ATTRIBUTE_VALUE_LENGTH))),
      v.maxLength(MAX_ATTRIBUTE_VALUES)
    )
  ),
  v.check(
    (attributes) => Object.keys(attributes).length <= MAX_ATTRIBUTE_KEYS,
    `at most ${MAX_ATTRIBUTE_KEYS} attributes are allowed`
  )
);

const resourceInputSchema = v.object({
  attributes: v.optional(attributesSchema),
  category: v.optional(
    v.pipe(v.string(), v.trim(), v.maxLength(MAX_CATEGORY_LENGTH))
  ),
  description: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1),
    v.maxLength(MAX_DESCRIPTION_LENGTH),
    v.transform(sanitizeDescription)
  ),
  id: v.pipe(v.string(), v.trim(), v.regex(ID_PATTERN)),
  price: v.optional(
    v.pipe(v.number(), v.finite(), v.minValue(0), v.maxValue(MAX_PRICE))
  ),
  section: sectionSchema,
  tags: v.optional(v.pipe(v.array(tagSchema), v.maxLength(MAX_TAGS))),
  title: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1),
    v.maxLength(MAX_TITLE_LENGTH)
  ),
});

const resourceUpdateSchema = v.partial(v.omit(resourceInputSchema, ["id"]));

/** Human-readable message from the first valibot issue. */
function firstIssueMessage(issues: readonly { message: string }[]): string {
  return issues[0]?.message ?? "Invalid input";
}

/**
 * Validate and sanitize resource input at the API boundary. Unknown keys are
 * stripped (e.g. a client-sent `authorId` is never trusted). Returns a
 * validated payload, or a user-facing error message.
 */
export function validateResourceInput(input: JsonValue): ValidationResult {
  const result = v.safeParse(resourceInputSchema, input);
  if (!result.success) {
    return { error: firstIssueMessage(result.issues), ok: false };
  }
  const { attributes, category, description, id, price, section, tags, title } =
    result.output;
  return {
    ok: true,
    value: {
      attributes: attributes ?? {},
      category,
      description,
      id,
      price: price ?? 0,
      section,
      tags: tags ?? [],
      title,
    },
  };
}

/**
 * Validate partial resource updates (PUT). Only fields that are present are
 * validated; `description` is sanitized during parsing.
 */
export function validateResourceUpdate(input: JsonValue): UpdateValidationResult {
  const result = v.safeParse(resourceUpdateSchema, input);
  if (!result.success) {
    return { error: firstIssueMessage(result.issues), ok: false };
  }
  return { ok: true, value: result.output };
}