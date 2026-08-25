import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const carcassYieldPercentageExample = {
  input: { carcassWeightKg: 300, liveWeightKg: 600 },
} satisfies ToolExample<{
  readonly carcassWeightKg: number;
  readonly liveWeightKg: number;
}>;

export const carcassYieldPercentageTool = createSimpleTool({
  id: "biology/carcass-yield-percentage",
  title: "Carcass Yield %",
  description:
    "Compute dressing yield as the carcass weight percentage of the live weight.",
  inputs: [
    {
      id: "carcassWeightKg",
      label: "Carcass weight kg",
      kind: "number",
      minimum: 0,
    },
    {
      id: "liveWeightKg",
      label: "Live weight kg",
      kind: "number",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "dressingYieldPercent",
      label: "Dressing yield percent",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const carcassWeightKg = input.carcassWeightKg as number;
    const liveWeightKg = input.liveWeightKg as number;
    if (carcassWeightKg < 0)
      simpleError("carcassWeightKg", "Carcass weight cannot be negative.");
    if (liveWeightKg <= 0)
      simpleError("liveWeightKg", "Live weight must be greater than zero.");
    if (carcassWeightKg > liveWeightKg)
      simpleError(
        "carcassWeightKg",
        "Carcass weight must not exceed live weight.",
      );
    return {
      dressingYieldPercent: (carcassWeightKg / liveWeightKg) * 100,
    };
  },
});
export const runCarcassYieldPercentage = carcassYieldPercentageTool.execute;
export default carcassYieldPercentageTool;
