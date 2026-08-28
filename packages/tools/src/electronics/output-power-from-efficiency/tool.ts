import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const outputPowerFromEfficiencyExample = {
  input: { efficiencyPercent: 85, inputPowerWatts: 100 },
  output: { outputPowerWatts: 85 },
} satisfies ToolExample<
  { readonly efficiencyPercent: number; readonly inputPowerWatts: number },
  { readonly outputPowerWatts: number }
>;

export const outputPowerFromEfficiencyTool = createSimpleTool({
  calculate: (input) => {
    const efficiencyPercent = input.efficiencyPercent as number;
    const inputPowerWatts = input.inputPowerWatts as number;
    if (!(efficiencyPercent >= 0 && efficiencyPercent <= 100))
      simpleError(
        "efficiencyPercent",
        "Efficiency must be between zero and one hundred percent.",
        "invalid_efficiency",
      );
    if (!(inputPowerWatts >= 0))
      simpleError(
        "inputPowerWatts",
        "Input power must not be negative.",
        "invalid_power",
      );
    return {
      outputPowerWatts: inputPowerWatts * (efficiencyPercent / 100),
    };
  },
  description:
    "Compute the delivered output power from an input power at a given efficiency percentage.",
  id: "electronics/output-power-from-efficiency",
  inputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency",
      unit: "%",
    },
    { id: "inputPowerWatts", kind: "number", label: "Input power", unit: "W" },
  ],
  outputs: [
    {
      id: "outputPowerWatts",
      kind: "number",
      label: "Output power",
      unit: "W",
    },
  ],
  title: "Output Power From Efficiency",
});
export const runOutputPowerFromEfficiency =
  outputPowerFromEfficiencyTool.execute;
export default outputPowerFromEfficiencyTool;
