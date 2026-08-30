import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeightDeviationFromStandardInput = Readonly<{
  readonly measuredWeightGrams: number;
  readonly standardWeightGrams: number;
}>;
export type WeightDeviationFromStandardOutput = Readonly<{
  readonly deviationPercent: number;
}>;

export const calculateWeightDeviationFromStandard = (
  x: WeightDeviationFromStandardInput,
): WeightDeviationFromStandardOutput => {
  if (!Number.isFinite(x.measuredWeightGrams) || x.measuredWeightGrams < 0)
    simpleError("measuredWeightGrams", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.standardWeightGrams) || x.standardWeightGrams <= 0)
    simpleError("standardWeightGrams", "Provide a finite positive number.");
  const deviationPercent =
    ((x.measuredWeightGrams - x.standardWeightGrams) / x.standardWeightGrams) *
    100;
  if (!Number.isFinite(deviationPercent))
    simpleError(
      "deviationPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    deviationPercent: Object.is(deviationPercent, -0) ? 0 : deviationPercent,
  };
};

export const example = {
  input: {
    measuredWeightGrams: 4.9,
    standardWeightGrams: 5,
  },
  output: { deviationPercent: -1.9999999999999927 },
} satisfies ToolExample<
  WeightDeviationFromStandardInput,
  WeightDeviationFromStandardOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/weight-deviation-from-standard",
  title: "Weight Deviation From Standard",
  description:
    "Report signed percentage difference from an issue-specific standard mass.",
  inputs: [
    {
      id: "measuredWeightGrams",
      kind: "number",
      label: "Measured Weight Grams",
      unit: "g",
    },
    {
      id: "standardWeightGrams",
      kind: "number",
      label: "Standard Weight Grams",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "deviationPercent",
      kind: "number",
      label: "Deviation Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateWeightDeviationFromStandard({
      measuredWeightGrams: input.measuredWeightGrams as number,
      standardWeightGrams: input.standardWeightGrams as number,
    }),
});
export const runWeightDeviationFromStandard = tool.execute;
export default tool;
