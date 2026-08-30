import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GonadosomaticIndexInput = Readonly<{
  readonly gonadWeightGrams: number;
  readonly bodyWeightGrams: number;
}>;
export type GonadosomaticIndexOutput = Readonly<{
  readonly gonadosomaticIndexPercent: number;
}>;

export const calculateGonadosomaticIndex = (
  x: GonadosomaticIndexInput,
): GonadosomaticIndexOutput => {
  if (!Number.isFinite(x.gonadWeightGrams) || x.gonadWeightGrams < 0)
    simpleError("gonadWeightGrams", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.bodyWeightGrams) || x.bodyWeightGrams <= 0)
    simpleError("bodyWeightGrams", "Provide a finite positive number.");
  if (x.gonadWeightGrams > x.bodyWeightGrams)
    simpleError("gonadWeightGrams", "Gonad mass cannot exceed body mass.");
  const gonadosomaticIndexPercent =
    (x.gonadWeightGrams / x.bodyWeightGrams) * 100;
  if (!Number.isFinite(gonadosomaticIndexPercent))
    simpleError(
      "gonadosomaticIndexPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    gonadosomaticIndexPercent: Object.is(gonadosomaticIndexPercent, -0)
      ? 0
      : gonadosomaticIndexPercent,
  };
};

export const example = {
  input: {
    gonadWeightGrams: 10,
    bodyWeightGrams: 100,
  },
  output: { gonadosomaticIndexPercent: 10 },
} satisfies ToolExample<GonadosomaticIndexInput, GonadosomaticIndexOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/gonadosomatic-index",
  title: "Gonadosomatic Index",
  description: "Express gonad mass as a percentage of whole-body mass.",
  inputs: [
    {
      id: "gonadWeightGrams",
      kind: "number",
      label: "Gonad Weight Grams",
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
      id: "gonadosomaticIndexPercent",
      kind: "number",
      label: "Gonadosomatic Index Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateGonadosomaticIndex({
      gonadWeightGrams: input.gonadWeightGrams as number,
      bodyWeightGrams: input.bodyWeightGrams as number,
    }),
});
export const runGonadosomaticIndex = tool.execute;
export default tool;
