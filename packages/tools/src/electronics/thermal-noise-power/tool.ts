import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const thermalNoisePowerExample = {
  input: { bandwidthHz: 10000 },
} satisfies ToolExample<{
  readonly bandwidthHz: number;
}>;

export const thermalNoisePowerTool = createSimpleTool({
  id: "electronics/thermal-noise-power",
  title: "Thermal Noise Power dBm",
  description:
    "Calculate kTB thermal noise power in dBm over a given bandwidth at room temperature.",
  inputs: [{ id: "bandwidthHz", label: "Bandwidth", kind: "number" }],
  outputs: [{ id: "thermalNoiseDbm", label: "Thermal noise", kind: "number" }],
  calculate: (input) => {
    const bandwidthHz = input.bandwidthHz as number;
    if (bandwidthHz <= 0)
      simpleError("bandwidthHz", "Bandwidth must be greater than zero.");
    return { thermalNoiseDbm: -174 + 10 * Math.log10(bandwidthHz) };
  },
});
export const runThermalNoisePower = thermalNoisePowerTool.execute;
export default thermalNoisePowerTool;
