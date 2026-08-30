import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ViscerosomaticIndexInput = Readonly<{
  readonly visceraWeightGrams: number;
  readonly bodyWeightGrams: number;
}>;
export type ViscerosomaticIndexOutput = Readonly<{
  readonly viscerosomaticIndexPercent: number;
}>;

export const calculateViscerosomaticIndex = (
  x: ViscerosomaticIndexInput,
): ViscerosomaticIndexOutput => {
  if (!Number.isFinite(x.visceraWeightGrams) || x.visceraWeightGrams < 0)
    simpleError("visceraWeightGrams", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.bodyWeightGrams) || x.bodyWeightGrams <= 0)
    simpleError("bodyWeightGrams", "Provide a finite positive number.");
  if (x.visceraWeightGrams > x.bodyWeightGrams)
    simpleError("visceraWeightGrams", "Viscera mass cannot exceed body mass.");
  const viscerosomaticIndexPercent =
    (x.visceraWeightGrams / x.bodyWeightGrams) * 100;
  if (!Number.isFinite(viscerosomaticIndexPercent))
    simpleError(
      "viscerosomaticIndexPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    viscerosomaticIndexPercent: Object.is(viscerosomaticIndexPercent, -0)
      ? 0
      : viscerosomaticIndexPercent,
  };
};

export const example = {
  input: {
    visceraWeightGrams: 15,
    bodyWeightGrams: 100,
  },
  output: { viscerosomaticIndexPercent: 15 },
} satisfies ToolExample<ViscerosomaticIndexInput, ViscerosomaticIndexOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/viscerosomatic-index",
  title: "Viscerosomatic Index",
  description: "Express visceral mass as a percentage of whole-body mass.",
  inputs: [
    {
      id: "visceraWeightGrams",
      kind: "number",
      label: "Viscera Weight Grams",
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
      id: "viscerosomaticIndexPercent",
      kind: "number",
      label: "Viscerosomatic Index Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateViscerosomaticIndex({
      visceraWeightGrams: input.visceraWeightGrams as number,
      bodyWeightGrams: input.bodyWeightGrams as number,
    }),
});
export const runViscerosomaticIndex = tool.execute;
export default tool;
