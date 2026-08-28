import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const quantizationStepExample = {
  input: { bits: 10, fullScaleVolts: 5 },
} satisfies ToolExample<{
  readonly bits: number;
  readonly fullScaleVolts: number;
}>;

export const quantizationStepTool = createSimpleTool({
  id: "electronics/quantization-step",
  title: "LSB Step Size",
  description:
    "Calculate the least-significant-bit step size of an ADC from its full-scale voltage.",
  inputs: [
    { id: "fullScaleVolts", label: "Full-scale voltage", kind: "number" },
    { id: "bits", label: "Bits", kind: "integer", maximum: 32, minimum: 1 },
  ],
  outputs: [{ id: "lsbVoltage", label: "LSB voltage", kind: "number" }],
  calculate: (input) => {
    const fullScaleVolts = input.fullScaleVolts as number;
    const bits = input.bits as number;
    if (fullScaleVolts <= 0)
      simpleError(
        "fullScaleVolts",
        "Full-scale voltage must be greater than zero.",
      );
    return { lsbVoltage: fullScaleVolts / Math.pow(2, bits) };
  },
});
export const runQuantizationStep = quantizationStepTool.execute;
export default quantizationStepTool;
