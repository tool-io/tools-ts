import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PersistentIdSlugGeneratorInput = {
  readonly title: string;
  readonly maxLength?: number;
};

export type PersistentIdSlugGeneratorOutput = {
  readonly slug: string;
};

const asciiFold = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const calculatePersistentIdSlugGenerator = (
  input: PersistentIdSlugGeneratorInput,
): PersistentIdSlugGeneratorOutput => {
  const maxLength = input.maxLength ?? 60;
  if (!(Number.isInteger(maxLength) && maxLength >= 10))
    simpleError(
      "maxLength",
      "Maximum length must be an integer of at least 10.",
      "invalid_length",
    );
  const folded = asciiFold(input.title);
  let slug = folded.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (slug.length > maxLength) {
    slug = slug.slice(0, maxLength);
    const lastBoundary = slug.lastIndexOf("-");
    if (lastBoundary > 0) slug = slug.slice(0, lastBoundary);
    slug = slug.replace(/-+$/g, "");
  }
  if (slug.length === 0)
    simpleError(
      "title",
      "Title must contain at least one ASCII letter or digit after normalization.",
      "empty_slug",
    );
  return { slug };
};

export const persistentIdSlugGeneratorExample = {
  input: {
    title: "Guide to the Papers of the Café Society Collection!",
    maxLength: 60,
  },
  output: { slug: "guide-to-the-papers-of-the-cafe-society-collection" },
} satisfies ToolExample<
  PersistentIdSlugGeneratorInput,
  PersistentIdSlugGeneratorOutput
>;

export const persistentIdSlugGeneratorTool = createSimpleTool({
  id: "archival-studies/persistent-id-slug-generator",
  title: "Finding Aid URL Persistent Identifier Slug Generator",
  description:
    "Turn a finding aid title into a URL slug by accent-folding, lowercasing and replacing non-alphanumeric runs with hyphens, truncated on a word boundary.",
  inputs: [
    {
      description: "Finding aid or collection title.",
      id: "title",
      kind: "string",
      label: "Title",
    },
    {
      default: 60,
      description: "Maximum slug length in characters.",
      id: "maxLength",
      kind: "integer",
      label: "Max length",
      minimum: 10,
    },
  ],
  outputs: [
    {
      description: "Lowercase hyphen-delimited slug.",
      id: "slug",
      kind: "string",
      label: "Slug",
    },
  ],
  calculate: (input) =>
    calculatePersistentIdSlugGenerator({
      maxLength: (input.maxLength as number | undefined) ?? undefined,
      title: input.title as string,
    }),
});

export const runPersistentIdSlugGenerator =
  persistentIdSlugGeneratorTool.execute;
export default persistentIdSlugGeneratorTool;
