import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const efficiencyPercentExample = {
  input: { inputPowerWatts: 100, outputPowerWatts: 75 },
  output: { efficiencyPercent: 75 },
} satisfies ToolExample<
  { readonly inputPowerWatts: number; readonly outputPowerWatts: number },
  { readonly efficiencyPercent: number }
>;

export const efficiencyPercentTool = createSimpleTool({
  calculate: (input) => {
    const pIn = input.inputPowerWatts as number;
    const pOut = input.outputPowerWatts as number;
    if (!(pIn > 0))
      simpleError(
        "inputPowerWatts",
        "Input power must be positive.",
        "invalid_power",
      );
    if (!(pOut >= 0 && pOut <= pIn))
      simpleError(
        "outputPowerWatts",
        "Output power must be between zero and the input power.",
        "invalid_power",
      );
    return { efficiencyPercent: (pOut / pIn) * 100 };
  },
  description:
    "Compute the percentage efficiency of a power conversion from output over input power.",
  id: "electronics/efficiency-percent",
  inputs: [
    { id: "inputPowerWatts", kind: "number", label: "Input power", unit: "W" },
    {
      id: "outputPowerWatts",
      kind: "number",
      label: "Output power",
      unit: "W",
    },
  ],
  outputs: [
    { id: "efficiencyPercent", kind: "number", label: "Efficiency", unit: "%" },
  ],
  title: "Efficiency Percent",
});
export const runEfficiencyPercent = efficiencyPercentTool.execute;
export default efficiencyPercentTool;
