import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SilverFinenessWeightContentInput = Readonly<{
  readonly grossWeightGrams: number;
  readonly finenessPerMille: number;
}>;
export type SilverFinenessWeightContentOutput = Readonly<{
  readonly fineSilverGrams: number;
}>;

export const calculateSilverFinenessWeightContent = (
  x: SilverFinenessWeightContentInput,
): SilverFinenessWeightContentOutput => {
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
  const fineSilverGrams = (x.grossWeightGrams * x.finenessPerMille) / 1000;
  if (!Number.isFinite(fineSilverGrams))
    simpleError(
      "fineSilverGrams",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    fineSilverGrams: Object.is(fineSilverGrams, -0) ? 0 : fineSilverGrams,
  };
};

export const example = {
  input: {
    grossWeightGrams: 40,
    finenessPerMille: 925,
  },
  output: { fineSilverGrams: 37 },
} satisfies ToolExample<
  SilverFinenessWeightContentInput,
  SilverFinenessWeightContentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/silver-fineness-weight-content",
  title: "Silver Fineness Weight Content",
  description:
    "Calculate fine silver mass from gross mass and millesimal fineness, excluding nonmetal inserts.",
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
      id: "fineSilverGrams",
      kind: "number",
      label: "Fine Silver Grams",
      unit: "g",
    },
  ],
  calculate: (input) =>
    calculateSilverFinenessWeightContent({
      grossWeightGrams: input.grossWeightGrams as number,
      finenessPerMille: input.finenessPerMille as number,
    }),
});
export const runSilverFinenessWeightContent = tool.execute;
export default tool;
