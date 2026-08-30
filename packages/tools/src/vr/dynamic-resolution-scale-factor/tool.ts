import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DynamicResolutionScaleFactorInput = Readonly<{
  readonly targetPixelCount: number;
  readonly basePixelCount: number;
}>;
export type DynamicResolutionScaleFactorOutput = Readonly<{
  readonly linearScaleFactor: number;
}>;

export const calculateDynamicResolutionScaleFactor = (
  x: DynamicResolutionScaleFactorInput,
): DynamicResolutionScaleFactorOutput => {
  if (!Number.isFinite(x.targetPixelCount) || x.targetPixelCount <= 0)
    simpleError("targetPixelCount", "Provide a finite positive number.");
  if (!Number.isFinite(x.basePixelCount) || x.basePixelCount <= 0)
    simpleError("basePixelCount", "Provide a finite positive number.");
  const linearScaleFactor = Math.sqrt(x.targetPixelCount / x.basePixelCount);
  if (!Number.isFinite(linearScaleFactor))
    simpleError(
      "linearScaleFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    linearScaleFactor: Object.is(linearScaleFactor, -0) ? 0 : linearScaleFactor,
  };
};

export const example = {
  input: {
    targetPixelCount: 2073600,
    basePixelCount: 8294400,
  },
  output: { linearScaleFactor: 0.5 },
} satisfies ToolExample<
  DynamicResolutionScaleFactorInput,
  DynamicResolutionScaleFactorOutput
>;

export const tool = createSimpleTool({
  id: "vr/dynamic-resolution-scale-factor",
  title: "Dynamic Resolution Scale Factor",
  description:
    "Uniform linear render-scale factor needed for a target pixel budget relative to base resolution.",
  inputs: [
    {
      id: "targetPixelCount",
      kind: "number",
      label: "Target Pixel Count",
      unit: "pixels",
      minimum: 0,
    },
    {
      id: "basePixelCount",
      kind: "number",
      label: "Base Pixel Count",
      unit: "pixels",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "linearScaleFactor", kind: "number", label: "Linear Scale Factor" },
  ],
  calculate: (input) =>
    calculateDynamicResolutionScaleFactor({
      targetPixelCount: input.targetPixelCount as number,
      basePixelCount: input.basePixelCount as number,
    }),
});
export const dynamicResolutionScaleFactorTool = tool;
export const runDynamicResolutionScaleFactor = tool.execute;
export default tool;
