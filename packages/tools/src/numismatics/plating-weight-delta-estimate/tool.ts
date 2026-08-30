import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlatingWeightDeltaEstimateInput = Readonly<{
  readonly platedWeightGrams: number;
  readonly unplatedWeightGrams: number;
}>;
export type PlatingWeightDeltaEstimateOutput = Readonly<{
  readonly platingMassGrams: number;
}>;

export const calculatePlatingWeightDeltaEstimate = (
  x: PlatingWeightDeltaEstimateInput,
): PlatingWeightDeltaEstimateOutput => {
  if (!Number.isFinite(x.platedWeightGrams) || x.platedWeightGrams < 0)
    simpleError("platedWeightGrams", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.unplatedWeightGrams) || x.unplatedWeightGrams < 0)
    simpleError("unplatedWeightGrams", "Provide a finite nonnegative number.");
  if (x.platedWeightGrams < x.unplatedWeightGrams)
    simpleError(
      "platedWeightGrams",
      "Plated weight must not be below unplated weight.",
    );
  const platingMassGrams = x.platedWeightGrams - x.unplatedWeightGrams;
  if (!Number.isFinite(platingMassGrams))
    simpleError(
      "platingMassGrams",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    platingMassGrams: Object.is(platingMassGrams, -0) ? 0 : platingMassGrams,
  };
};

export const example = {
  input: {
    platedWeightGrams: 20.2,
    unplatedWeightGrams: 20,
  },
  output: { platingMassGrams: 0.1999999999999993 },
} satisfies ToolExample<
  PlatingWeightDeltaEstimateInput,
  PlatingWeightDeltaEstimateOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/plating-weight-delta-estimate",
  title: "Plating Weight Delta Estimate",
  description:
    "Estimate plating mass from before-and-after weights, assuming no other material changed.",
  inputs: [
    {
      id: "platedWeightGrams",
      kind: "number",
      label: "Plated Weight Grams",
      unit: "g",
    },
    {
      id: "unplatedWeightGrams",
      kind: "number",
      label: "Unplated Weight Grams",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "platingMassGrams",
      kind: "number",
      label: "Plating Mass Grams",
      unit: "g",
    },
  ],
  calculate: (input) =>
    calculatePlatingWeightDeltaEstimate({
      platedWeightGrams: input.platedWeightGrams as number,
      unplatedWeightGrams: input.unplatedWeightGrams as number,
    }),
});
export const runPlatingWeightDeltaEstimate = tool.execute;
export default tool;
