import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClippedPlanchetWeightLossInput = Readonly<{
  readonly standardWeightGrams: number;
  readonly actualWeightGrams: number;
}>;
export type ClippedPlanchetWeightLossOutput = Readonly<{
  readonly weightLossPercent: number;
}>;

export const calculateClippedPlanchetWeightLoss = (
  x: ClippedPlanchetWeightLossInput,
): ClippedPlanchetWeightLossOutput => {
  if (!Number.isFinite(x.standardWeightGrams) || x.standardWeightGrams <= 0)
    simpleError("standardWeightGrams", "Provide a finite positive number.");
  if (!Number.isFinite(x.actualWeightGrams) || x.actualWeightGrams < 0)
    simpleError("actualWeightGrams", "Provide a finite nonnegative number.");
  if (x.actualWeightGrams > x.standardWeightGrams)
    simpleError(
      "actualWeightGrams",
      "Actual mass cannot exceed standard mass for a loss estimate.",
    );
  const weightLossPercent =
    ((x.standardWeightGrams - x.actualWeightGrams) / x.standardWeightGrams) *
    100;
  if (!Number.isFinite(weightLossPercent))
    simpleError(
      "weightLossPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    weightLossPercent: Object.is(weightLossPercent, -0) ? 0 : weightLossPercent,
  };
};

export const example = {
  input: {
    standardWeightGrams: 5,
    actualWeightGrams: 4.5,
  },
  output: { weightLossPercent: 10 },
} satisfies ToolExample<
  ClippedPlanchetWeightLossInput,
  ClippedPlanchetWeightLossOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/clipped-planchet-weight-loss",
  title: "Clipped Planchet Weight Loss",
  description:
    "Quantify missing mass against a standard planchet weight; mass loss alone cannot authenticate a clip.",
  inputs: [
    {
      id: "standardWeightGrams",
      kind: "number",
      label: "Standard Weight Grams",
      unit: "g",
    },
    {
      id: "actualWeightGrams",
      kind: "number",
      label: "Actual Weight Grams",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "weightLossPercent",
      kind: "number",
      label: "Weight Loss Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateClippedPlanchetWeightLoss({
      standardWeightGrams: input.standardWeightGrams as number,
      actualWeightGrams: input.actualWeightGrams as number,
    }),
});
export const runClippedPlanchetWeightLoss = tool.execute;
export default tool;
