import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const currentGainLinearExample = {
  input: { inputCurrentAmps: 0.01, outputCurrentAmps: 0.5 },
  output: { currentGain: 50 },
} satisfies ToolExample<
  { readonly inputCurrentAmps: number; readonly outputCurrentAmps: number },
  { readonly currentGain: number }
>;

export const currentGainLinearTool = createSimpleTool({
  calculate: (input) => {
    const iIn = input.inputCurrentAmps as number;
    if (iIn === 0)
      simpleError(
        "inputCurrentAmps",
        "Input current must be nonzero.",
        "invalid_current",
      );
    return {
      currentGain: (input.outputCurrentAmps as number) / iIn,
    };
  },
  description:
    "Compute the linear current gain as the ratio of output to input current.",
  id: "electronics/current-gain-linear",
  inputs: [
    {
      id: "inputCurrentAmps",
      kind: "number",
      label: "Input current",
      unit: "A",
    },
    {
      id: "outputCurrentAmps",
      kind: "number",
      label: "Output current",
      unit: "A",
    },
  ],
  outputs: [{ id: "currentGain", kind: "number", label: "Gain", unit: "A/A" }],
  title: "Current Gain Linear",
});
export const runCurrentGainLinear = currentGainLinearTool.execute;
export default currentGainLinearTool;
