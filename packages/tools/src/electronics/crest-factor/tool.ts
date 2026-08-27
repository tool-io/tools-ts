import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const crestFactorExample = {
  input: { peakVoltageV: 14.142135623730951, rmsVoltageV: 10 },
} satisfies ToolExample<{
  readonly peakVoltageV: number;
  readonly rmsVoltageV: number;
}>;

export const crestFactorTool = createSimpleTool({
  id: "electronics/crest-factor",
  title: "Crest Factor",
  description:
    "Calculate the crest factor of a waveform from its peak and RMS voltages.",
  inputs: [
    {
      id: "peakVoltageV",
      label: "Peak voltage",
      kind: "number",
      unit: "V",
    },
    { id: "rmsVoltageV", label: "RMS voltage", kind: "number", unit: "V" },
  ],
  outputs: [{ id: "crestFactor", label: "Crest factor", kind: "number" }],
  calculate: (input) => {
    const rmsVoltageV = input.rmsVoltageV as number;
    if (rmsVoltageV <= 0)
      simpleError("rmsVoltageV", "RMS voltage must be positive.");
    return {
      crestFactor: (input.peakVoltageV as number) / rmsVoltageV,
    };
  },
});
export const runCrestFactor = crestFactorTool.execute;
export default crestFactorTool;
