import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EyeHeightEstimateInput = Readonly<{
  readonly minimumHighVoltageV: number;
  readonly maximumLowVoltageV: number;
}>;
export type EyeHeightEstimateOutput = Readonly<{ eyeHeightV: number }>;

export const calculateEyeHeightEstimate = (
  i: EyeHeightEstimateInput,
): EyeHeightEstimateOutput => {
  const value = i.minimumHighVoltageV - i.maximumLowVoltageV;
  if (!Number.isFinite(value))
    simpleError("eyeHeightV", "The inputs produce a non-finite result.");
  return { eyeHeightV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { minimumHighVoltageV: 2.7, maximumLowVoltageV: 0.4 },
  output: { eyeHeightV: 2.3000000000000003 },
} satisfies ToolExample<EyeHeightEstimateInput, EyeHeightEstimateOutput>;

export const tool = createSimpleTool({
  id: "electronics/eye-height-estimate",
  title: "Eye Height Estimate",
  description:
    "Find the vertical eye opening at the sampling instant as the minimum high level minus the maximum low level; a negative value means overlapping level distributions.",
  inputs: [
    {
      id: "minimumHighVoltageV",
      kind: "number",
      label: "Minimum High (V)",
      unit: "V",
    },
    {
      id: "maximumLowVoltageV",
      kind: "number",
      label: "Maximum Low (V)",
      unit: "V",
    },
  ],
  outputs: [
    { id: "eyeHeightV", kind: "number", label: "Eye Height (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculateEyeHeightEstimate({
      minimumHighVoltageV: input.minimumHighVoltageV as number,
      maximumLowVoltageV: input.maximumLowVoltageV as number,
    }),
});
export const eyeHeightEstimateTool = tool;
export const runEyeHeightEstimate = tool.execute;
export default tool;
