import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const parseSet = (text: string): Set<string> | null => {
  const values = text
    .split(/[,;\n]+/)
    .map((value) => value.trim())
    .filter(Boolean);
  return values.length > 0 ? new Set(values) : null;
};

export const jaccardSimilarity = (
  firstText: string,
  secondText: string,
): number | null => {
  const first = parseSet(firstText);
  const second = parseSet(secondText);
  if (!first || !second) return null;
  const intersection = [...first].filter((value) => second.has(value)).length;
  return intersection / new Set([...first, ...second]).size;
};

export const jaccardSimilarityExample = {
  input: { first: "apple, banana, pear", second: "banana, pear, orange" },
  output: { similarity: 0.5 },
} satisfies ToolExample<
  { readonly first: string; readonly second: string },
  { readonly similarity: number }
>;

export const jaccardSimilarityTool = createSimpleTool({
  id: "similarity/jaccard",
  title: "Jaccard Similarity Calculator",
  description:
    "Compare two sets using the size of their intersection and union.",
  inputs: [
    { format: "set/string", id: "first", kind: "string", label: "First set" },
    { format: "set/string", id: "second", kind: "string", label: "Second set" },
  ],
  outputs: [
    {
      id: "similarity",
      kind: "number",
      label: "Jaccard similarity",
      maximum: 1,
      minimum: 0,
    },
  ],
  calculate: (input) => {
    const similarity = jaccardSimilarity(
      input.first as string,
      input.second as string,
    );
    if (similarity === null)
      return simpleError("first", "Enter two nonempty sets.");
    return { similarity };
  },
});

export const runJaccardSimilarity = jaccardSimilarityTool.execute;
export default jaccardSimilarityTool;
