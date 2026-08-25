import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const chanterelleStandYieldSurveyEstimatorExample = {
  input: { meanPatchYieldG: 250, patchesCountedInt: 40 },
  output: { standYieldKg: 10 },
} satisfies ToolExample<
  {
    readonly meanPatchYieldG: number;
    readonly patchesCountedInt: number;
  },
  {
    readonly standYieldKg: number;
  }
>;

export const chanterelleStandYieldSurveyEstimatorTool = createSimpleTool({
  id: "mycology/chanterelle-stand-yield-survey-estimator",
  title: "Stand Yield Estimate",
  description:
    "Estimate total stand yield in kilograms from the number of counted patches and the mean patch yield in grams.",
  inputs: [
    {
      id: "patchesCountedInt",
      label: "Patches counted",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "meanPatchYieldG",
      label: "Mean patch yield",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "standYieldKg",
      label: "Stand yield",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const standYieldKg =
      ((input.patchesCountedInt as number) *
        (input.meanPatchYieldG as number)) /
      1000;
    if (!Number.isFinite(standYieldKg))
      simpleError(
        "meanPatchYieldG",
        "The estimated stand yield is too large to represent.",
      );
    return { standYieldKg };
  },
});
export const runChanterelleStandYieldSurveyEstimator =
  chanterelleStandYieldSurveyEstimatorTool.execute;
export default chanterelleStandYieldSurveyEstimatorTool;
