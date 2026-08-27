import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PrimerEfficiencyFromSlopeInput = {
  readonly slope: number;
};

export type PrimerEfficiencyFromSlopeOutput = {
  readonly efficiencyPercent: number;
};

export const primerEfficiencyFromSlopeExample = {
  input: { slope: -3.32 },
  output: { efficiencyPercent: 100.08052545562056 },
} satisfies ToolExample<
  PrimerEfficiencyFromSlopeInput,
  PrimerEfficiencyFromSlopeOutput
>;

export const primerEfficiencyFromSlopeTool = createSimpleTool({
  id: "biology/primer-efficiency-from-slope",
  title: "Primer Efficiency From Slope",
  description:
    "Derive qPCR primer efficiency in percent from the standard curve slope.",
  inputs: [{ id: "slope", label: "Standard curve slope", kind: "number" }],
  outputs: [
    {
      id: "efficiencyPercent",
      label: "Primer efficiency",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const slope = input.slope as number;
    if (!(slope < 0))
      simpleError(
        "slope",
        "Slope must be negative for a qPCR standard curve.",
        "invalid_slope",
      );
    return { efficiencyPercent: (Math.pow(10, -1 / slope) - 1) * 100 };
  },
});
export const runPrimerEfficiencyFromSlope =
  primerEfficiencyFromSlopeTool.execute;
export default primerEfficiencyFromSlopeTool;
