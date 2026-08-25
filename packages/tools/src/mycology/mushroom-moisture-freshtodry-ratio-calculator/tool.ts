import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const freshToDryRatioCalculatorExample = {
  input: { dryMassG: 10, freshMassG: 100 },
  output: { freshToDryRatio: 10 },
} satisfies ToolExample<
  { readonly dryMassG: number; readonly freshMassG: number },
  { readonly freshToDryRatio: number }
>;

export const freshToDryRatioCalculatorTool = createSimpleTool({
  id: "mycology/mushroom-moisture-freshtodry-ratio-calculator",
  title: "Fresh:Dry Ratio",
  description:
    "Compute the fresh-to-dry mass ratio of a mushroom specimen to characterize its moisture content.",
  inputs: [
    {
      id: "freshMassG",
      kind: "number",
      label: "Fresh mass",
      minimum: 0,
      unit: "g",
    },
    {
      id: "dryMassG",
      kind: "number",
      label: "Dry mass",
      minimum: Number.MIN_VALUE,
      unit: "g",
    },
  ],
  outputs: [
    { id: "freshToDryRatio", kind: "number", label: "Fresh to dry ratio" },
  ],
  calculate: (input) => {
    const freshMassG = input.freshMassG as number;
    const dryMassG = input.dryMassG as number;
    if (freshMassG < dryMassG)
      simpleError(
        "freshMassG",
        "Fresh mass must be greater than or equal to dry mass.",
        "invalid_masses",
      );
    const freshToDryRatio = freshMassG / dryMassG;
    if (!Number.isFinite(freshToDryRatio))
      simpleError(
        "freshMassG",
        "The fresh-to-dry ratio is too large to represent.",
        "invalid_masses",
      );
    return { freshToDryRatio };
  },
});
export const runFreshToDryRatioCalculator =
  freshToDryRatioCalculatorTool.execute;
export default freshToDryRatioCalculatorTool;
