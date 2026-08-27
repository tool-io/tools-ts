import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const formFactorExample = {
  input: { peakVoltageV: 10 },
} satisfies ToolExample<{ readonly peakVoltageV: number }>;

export const formFactorTool = createSimpleTool({
  id: "electronics/form-factor",
  title: "Form Factor",
  description:
    "Calculate the form factor of a sinusoid as RMS voltage divided by average rectified voltage.",
  inputs: [
    {
      id: "peakVoltageV",
      label: "Peak voltage",
      kind: "number",
      unit: "V",
    },
  ],
  outputs: [{ id: "formFactor", label: "Form factor", kind: "number" }],
  calculate: (input) => {
    const peakVoltageV = input.peakVoltageV as number;
    if (peakVoltageV <= 0)
      simpleError("peakVoltageV", "Peak voltage must be positive.");
    return {
      formFactor: peakVoltageV / Math.SQRT2 / ((peakVoltageV * 2) / Math.PI),
    };
  },
});
export const runFormFactor = formFactorTool.execute;
export default formFactorTool;
