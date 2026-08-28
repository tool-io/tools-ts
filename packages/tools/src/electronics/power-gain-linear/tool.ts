import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const powerGainLinearExample = {
  input: { inputPowerWatts: 4, outputPowerWatts: 100 },
  output: { powerGain: 25 },
} satisfies ToolExample<
  { readonly inputPowerWatts: number; readonly outputPowerWatts: number },
  { readonly powerGain: number }
>;

export const powerGainLinearTool = createSimpleTool({
  calculate: (input) => {
    const inputPowerWatts = input.inputPowerWatts as number;
    const outputPowerWatts = input.outputPowerWatts as number;
    if (!(inputPowerWatts > 0))
      simpleError(
        "inputPowerWatts",
        "Input power must be greater than zero.",
        "invalid_power",
      );
    if (!(outputPowerWatts >= 0))
      simpleError(
        "outputPowerWatts",
        "Output power must not be negative.",
        "invalid_power",
      );
    return { powerGain: outputPowerWatts / inputPowerWatts };
  },
  description:
    "Compute the linear power gain as the ratio of output to input power.",
  id: "electronics/power-gain-linear",
  inputs: [
    { id: "inputPowerWatts", kind: "number", label: "Input power", unit: "W" },
    {
      id: "outputPowerWatts",
      kind: "number",
      label: "Output power",
      unit: "W",
    },
  ],
  outputs: [{ id: "powerGain", kind: "number", label: "Gain", unit: "W/W" }],
  title: "Linear Power Gain",
});
export const runPowerGainLinear = powerGainLinearTool.execute;
export default powerGainLinearTool;
