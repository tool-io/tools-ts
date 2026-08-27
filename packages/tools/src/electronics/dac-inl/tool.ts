import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const dacInlExample = {
  input: { lsbSizeVolts: 0.001, maxDeviationVolts: 0.005 },
} satisfies ToolExample<{
  readonly lsbSizeVolts: number;
  readonly maxDeviationVolts: number;
}>;

export const dacInlTool = createSimpleTool({
  id: "electronics/dac-inl",
  title: "DAC INL LSB",
  description:
    "Express integral nonlinearity in least-significant-bit counts as inlLsb = maxDeviationVolts / lsbSizeVolts.",
  inputs: [
    {
      description:
        "Largest deviation of the transfer curve from the ideal line.",
      id: "maxDeviationVolts",
      kind: "number",
      label: "Max Deviation",
      unit: "V",
    },
    {
      description: "Ideal step size of one code.",
      id: "lsbSizeVolts",
      kind: "number",
      label: "LSB Size",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Integral nonlinearity in LSB counts.",
      id: "inlLsbCount",
      kind: "number",
      label: "INL",
      unit: "LSB",
    },
  ],
  calculate: (input) => {
    const maxDeviationVolts = input.maxDeviationVolts as number;
    const lsbSizeVolts = input.lsbSizeVolts as number;
    if (!(lsbSizeVolts > 0))
      simpleError("lsbSizeVolts", "LSB size must be positive.");
    if (!(maxDeviationVolts >= 0))
      simpleError("maxDeviationVolts", "Deviation must not be negative.");
    return { inlLsbCount: maxDeviationVolts / lsbSizeVolts };
  },
});
export const runDacInl = dacInlTool.execute;
export default dacInlTool;
