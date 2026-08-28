import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const powerGainDbExample = {
  input: { inputPowerWatts: 1, outputPowerWatts: 100 },
  output: { gainDb: 20 },
} satisfies ToolExample<
  { readonly inputPowerWatts: number; readonly outputPowerWatts: number },
  { readonly gainDb: number }
>;

export const powerGainDbTool = createSimpleTool({
  calculate: (input) => {
    const pIn = input.inputPowerWatts as number;
    const pOut = input.outputPowerWatts as number;
    if (!(pIn > 0))
      simpleError(
        "inputPowerWatts",
        "Input power must be positive.",
        "invalid_power",
      );
    if (!(pOut > 0))
      simpleError(
        "outputPowerWatts",
        "Output power must be positive.",
        "invalid_power",
      );
    return { gainDb: 10 * Math.log10(pOut / pIn) };
  },
  description: "Express a power ratio as a decibel gain.",
  id: "electronics/power-gain-db",
  inputs: [
    { id: "inputPowerWatts", kind: "number", label: "Input power", unit: "W" },
    {
      id: "outputPowerWatts",
      kind: "number",
      label: "Output power",
      unit: "W",
    },
  ],
  outputs: [{ id: "gainDb", kind: "number", label: "Gain", unit: "dB" }],
  title: "Power Gain dB",
});
export const runPowerGainDb = powerGainDbTool.execute;
export default powerGainDbTool;
