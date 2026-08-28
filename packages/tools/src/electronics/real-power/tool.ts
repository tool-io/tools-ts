import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const realPowerExample = {
  input: { ampsRms: 0.5, powerFactor: 0.8, voltsRms: 120 },
} satisfies ToolExample<{
  readonly ampsRms: number;
  readonly powerFactor: number;
  readonly voltsRms: number;
}>;

export const realPowerTool = createSimpleTool({
  id: "electronics/real-power",
  title: "Real Power Watts",
  description:
    "Calculate real power in watts from RMS voltage, RMS current, and power factor.",
  inputs: [
    { id: "voltsRms", label: "RMS voltage", kind: "number", unit: "V" },
    { id: "ampsRms", label: "RMS current", kind: "number", unit: "A" },
    {
      id: "powerFactor",
      label: "Power factor",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    { id: "realPowerWatts", label: "Real power", kind: "number", unit: "W" },
  ],
  calculate: (input) => ({
    realPowerWatts:
      (input.voltsRms as number) *
      (input.ampsRms as number) *
      (input.powerFactor as number),
  }),
});
export const runRealPower = realPowerTool.execute;
export default realPowerTool;
