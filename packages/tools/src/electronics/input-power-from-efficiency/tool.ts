import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const inputPowerFromEfficiencyExample = {
  input: { efficiencyPercent: 80, outputPowerWatts: 80 },
  output: { inputPowerWatts: 100 },
} satisfies ToolExample<
  { readonly efficiencyPercent: number; readonly outputPowerWatts: number },
  { readonly inputPowerWatts: number }
>;

export const inputPowerFromEfficiencyTool = createSimpleTool({
  calculate: (input) => {
    const percent = input.efficiencyPercent as number;
    const pOut = input.outputPowerWatts as number;
    if (!(pOut > 0))
      simpleError(
        "outputPowerWatts",
        "Output power must be positive.",
        "invalid_power",
      );
    if (!(percent > 0 && percent < 100))
      simpleError(
        "efficiencyPercent",
        "Efficiency must be strictly between zero and one hundred percent.",
        "invalid_percent",
      );
    return { inputPowerWatts: pOut / (percent / 100) };
  },
  description:
    "Derive the required input power from a delivered output power at a given efficiency percentage.",
  id: "electronics/input-power-from-efficiency",
  inputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency",
      unit: "%",
    },
    {
      id: "outputPowerWatts",
      kind: "number",
      label: "Output power",
      unit: "W",
    },
  ],
  outputs: [
    { id: "inputPowerWatts", kind: "number", label: "Input power", unit: "W" },
  ],
  title: "Input Power From Efficiency",
});
export const runInputPowerFromEfficiency = inputPowerFromEfficiencyTool.execute;
export default inputPowerFromEfficiencyTool;
