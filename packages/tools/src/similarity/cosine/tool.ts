import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { parseFiniteNumberList } from "../../parse/numeric-dataset/tool.js";

export const cosineSimilarity = (
  firstText: string,
  secondText: string,
): number | null => {
  const first = parseFiniteNumberList(firstText);
  const second = parseFiniteNumberList(secondText);
  if (!first || !second || first.length !== second.length) return null;
  const firstNorm = Math.hypot(...first);
  const secondNorm = Math.hypot(...second);
  if (firstNorm === 0 || secondNorm === 0) return null;
  const similarity =
    first.reduce((sum, value, index) => sum + value * (second[index] ?? 0), 0) /
    (firstNorm * secondNorm);
  return Math.max(-1, Math.min(1, Number(similarity.toFixed(15))));
};

export const cosineSimilarityExample = {
  input: { first: "1, 2, 3", second: "2, 4, 6" },
  output: { similarity: 1 },
} satisfies ToolExample<
  { readonly first: string; readonly second: string },
  { readonly similarity: number }
>;

export const cosineSimilarityTool = createSimpleTool({
  id: "similarity/cosine",
  title: "Cosine Similarity Calculator",
  description:
    "Measure the directional similarity of two equal-length numeric vectors.",
  inputs: [
    {
      format: "vector/number",
      id: "first",
      kind: "string",
      label: "First vector",
    },
    {
      format: "vector/number",
      id: "second",
      kind: "string",
      label: "Second vector",
    },
  ],
  outputs: [
    {
      id: "similarity",
      kind: "number",
      label: "Cosine similarity",
      maximum: 1,
      minimum: -1,
    },
  ],
  calculate: (input) => {
    const similarity = cosineSimilarity(
      input.first as string,
      input.second as string,
    );
    if (similarity === null)
      return simpleError(
        "first",
        "Enter two nonzero vectors with equal lengths.",
      );
    return { similarity };
  },
});

export const runCosineSimilarity = cosineSimilarityTool.execute;
export default cosineSimilarityTool;
