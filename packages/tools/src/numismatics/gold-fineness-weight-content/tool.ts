import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GoldFinenessWeightContentInput = Readonly<{
  readonly grossWeightGrams: number;
  readonly finenessPerMille: number;
}>;
export type GoldFinenessWeightContentOutput = Readonly<{
  readonly fineGoldGrams: number;
}>;

export const calculateGoldFinenessWeightContent = (
  x: GoldFinenessWeightContentInput,
): GoldFinenessWeightContentOutput => {
  if (!Number.isFinite(x.grossWeightGrams) || x.grossWeightGrams < 0)
    simpleError("grossWeightGrams", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.finenessPerMille) ||
    x.finenessPerMille < 0 ||
    x.finenessPerMille > 1000
  )
    simpleError(
      "finenessPerMille",
      "Provide a finite nonnegative number no greater than 1000.",
    );
  const fineGoldGrams = (x.grossWeightGrams * x.finenessPerMille) / 1000;
  if (!Number.isFinite(fineGoldGrams))
    simpleError(
      "fineGoldGrams",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { fineGoldGrams: Object.is(fineGoldGrams, -0) ? 0 : fineGoldGrams };
};

export const example = {
  input: {
    grossWeightGrams: 20,
    finenessPerMille: 750,
  },
  output: { fineGoldGrams: 15 },
} satisfies ToolExample<
  GoldFinenessWeightContentInput,
  GoldFinenessWeightContentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/gold-fineness-weight-content",
  title: "Gold Fineness Weight Content",
  description:
    "Calculate fine gold mass from gross mass and millesimal fineness.",
  inputs: [
    {
      id: "grossWeightGrams",
      kind: "number",
      label: "Gross Weight Grams",
      unit: "g",
    },
    {
      id: "finenessPerMille",
      kind: "number",
      label: "Fineness Per Mille",
      unit: "‰",
    },
  ],
  outputs: [
    {
      id: "fineGoldGrams",
      kind: "number",
      label: "Fine Gold Grams",
      unit: "g",
    },
  ],
  calculate: (input) =>
    calculateGoldFinenessWeightContent({
      grossWeightGrams: input.grossWeightGrams as number,
      finenessPerMille: input.finenessPerMille as number,
    }),
});
export const runGoldFinenessWeightContent = tool.execute;
export default tool;
