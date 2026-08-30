import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HepatosomaticIndexInput = Readonly<{
  readonly liverWeightGrams: number;
  readonly bodyWeightGrams: number;
}>;
export type HepatosomaticIndexOutput = Readonly<{
  readonly hepatosomaticIndexPercent: number;
}>;

export const calculateHepatosomaticIndex = (
  x: HepatosomaticIndexInput,
): HepatosomaticIndexOutput => {
  if (!Number.isFinite(x.liverWeightGrams) || x.liverWeightGrams < 0)
    simpleError("liverWeightGrams", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.bodyWeightGrams) || x.bodyWeightGrams <= 0)
    simpleError("bodyWeightGrams", "Provide a finite positive number.");
  if (x.liverWeightGrams > x.bodyWeightGrams)
    simpleError("liverWeightGrams", "Liver mass cannot exceed body mass.");
  const hepatosomaticIndexPercent =
    (x.liverWeightGrams / x.bodyWeightGrams) * 100;
  if (!Number.isFinite(hepatosomaticIndexPercent))
    simpleError(
      "hepatosomaticIndexPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    hepatosomaticIndexPercent: Object.is(hepatosomaticIndexPercent, -0)
      ? 0
      : hepatosomaticIndexPercent,
  };
};

export const example = {
  input: {
    liverWeightGrams: 5,
    bodyWeightGrams: 100,
  },
  output: { hepatosomaticIndexPercent: 5 },
} satisfies ToolExample<HepatosomaticIndexInput, HepatosomaticIndexOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/hepatosomatic-index",
  title: "Hepatosomatic Index",
  description: "Express liver mass as a percentage of whole-body mass.",
  inputs: [
    {
      id: "liverWeightGrams",
      kind: "number",
      label: "Liver Weight Grams",
      unit: "g",
    },
    {
      id: "bodyWeightGrams",
      kind: "number",
      label: "Body Weight Grams",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "hepatosomaticIndexPercent",
      kind: "number",
      label: "Hepatosomatic Index Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateHepatosomaticIndex({
      liverWeightGrams: input.liverWeightGrams as number,
      bodyWeightGrams: input.bodyWeightGrams as number,
    }),
});
export const runHepatosomaticIndex = tool.execute;
export default tool;
