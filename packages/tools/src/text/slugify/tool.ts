import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type SlugifyInput = {
  readonly separator?: string;
  readonly text: string;
};

export type SlugifyOutput = {
  readonly slug: string;
};

const DIACRITICS = /[\u0300-\u036f]/g;

export const slugifyInputSchema = {
  additionalProperties: false,
  properties: {
    separator: {
      description: "Joiner between words, one or more characters.",
      maxLength: 8,
      minLength: 1,
      type: "string",
    },
    text: {
      description: "Text to convert into a URL-safe slug.",
      maxLength: 1000,
      minLength: 1,
      type: "string",
    },
  },
  required: ["text"],
  type: "object",
} as const;

export const slugifyOutputSchema = {
  additionalProperties: false,
  properties: {
    slug: {
      description: "Lowercase ASCII slug with normalized separators.",
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
      type: "string",
    },
  },
  required: ["slug"],
  type: "object",
} as const;

export const slugifyExample = {
  input: { text: "H\u00E9llo W\u00F6rld! 2026" },
  output: { slug: "hello-world-2026" },
} satisfies ToolExample<SlugifyInput, SlugifyOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isSlugifyOutput = (value: unknown): value is SlugifyOutput =>
  isRecord(value) && typeof value.slug === "string";

export const calculateSlugify = (
  input: unknown,
): ToolResult<SlugifyOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "separator" && field !== "text")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawText = input.text;
  if (rawText === undefined)
    return invalidInput([
      ...issues,
      {
        code: "text_required",
        field: "text",
        message: "text is required.",
      },
    ]);
  if (typeof rawText !== "string")
    return invalidInput([
      ...issues,
      {
        code: "text_invalid",
        field: "text",
        message: "text must be a string.",
      },
    ]);
  const limitIssue = resourceLimitIssue(
    "textCharacters",
    rawText.length,
    "text",
  );
  if (limitIssue) return invalidInput([...issues, limitIssue]);

  const rawSeparator =
    input.separator === undefined ? "-" : input.separator;
  if (
    typeof rawSeparator !== "string" ||
    rawSeparator.length < 1 ||
    rawSeparator.length > 8
  )
    return invalidInput([
      ...issues,
      {
        code: "separator_invalid",
        field: "separator",
        message: "separator must be a string of 1 to 8 characters.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);

  const asciiFolded = rawText
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase();
  const escapedSeparator = rawSeparator.replaceAll(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  const slug = asciiFolded
    .replaceAll(new RegExp(`[^a-z0-9]+`, "g"), rawSeparator)
    .replace(
      new RegExp(`^${escapedSeparator}+|${escapedSeparator}+$`, "g"),
      "",
    );
  if (slug.length === 0)
    return invalidInput([
      {
        code: "text_invalid",
        field: "text",
        message: "text must contain at least one letter or digit.",
      },
    ]);
  return toolSuccess({ slug });
};

export const slugifyTool = defineTool<SlugifyInput, SlugifyOutput>({
  contractVersion: 1,
  description:
    "Turn text into a lowercase URL-safe slug by folding diacritics and normalizing separators.",
  discovery: {
    aliases: ["url-slug-generator"],
    keywords: ["slug", "url", "web"],
  },
  execute: calculateSlugify,
  execution: { kind: "pure" },
  id: "text/slugify",
  inputSchema: slugifyInputSchema,
  outputSchema: slugifyOutputSchema,
  ports: {
    inputs: [
      {
        description: "Text to convert.",
        id: "text",
        label: "Text",
        required: true,
        valueType: { type: "string" },
      },
      {
        description: "Joiner between words.",
        id: "separator",
        label: "Separator",
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        description: "URL-safe slug.",
        id: "slug",
        label: "Slug",
        valueType: { format: "url-slug", type: "string" },
      },
    ],
  },
  title: "Slugify",
});

export const runSlugify = slugifyTool.execute;
export default slugifyTool;
