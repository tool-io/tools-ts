import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GoldenRatioTypeScaleInput = Readonly<{
  readonly basePixels: number;
  readonly step: number;
}>;
export type GoldenRatioTypeScaleOutput = Readonly<{
  readonly stepPixels: number;
}>;

export const calculateGoldenRatioTypeScale = (
  x: GoldenRatioTypeScaleInput,
): GoldenRatioTypeScaleOutput => {
  if (!Number.isFinite(x.basePixels) || x.basePixels <= 0)
    simpleError("basePixels", "Provide a finite positive number.");
  if (!Number.isFinite(x.step)) simpleError("step", "Provide a finite number.");
  if (!Number.isInteger(x.step))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const stepPixels = x.basePixels * ((1 + Math.sqrt(5)) / 2) ** x.step;
  if (!Number.isFinite(stepPixels))
    simpleError(
      "stepPixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { stepPixels: Object.is(stepPixels, -0) ? 0 : stepPixels };
};

export const example = {
  input: {
    basePixels: 16,
    step: 1,
  },
  output: { stepPixels: 25.88854381999832 },
} satisfies ToolExample<GoldenRatioTypeScaleInput, GoldenRatioTypeScaleOutput>;

export const tool = createSimpleTool({
  id: "typography/golden-ratio-type-scale",
  title: "Golden Ratio Type Scale",
  description: "Font size after an integer number of golden-ratio scale steps.",
  inputs: [
    {
      id: "basePixels",
      kind: "number",
      label: "Base Pixels",
      unit: "px",
      minimum: 0,
    },
    { id: "step", kind: "number", label: "Step" },
  ],
  outputs: [
    { id: "stepPixels", kind: "number", label: "Step Pixels", unit: "px" },
  ],
  calculate: (input) =>
    calculateGoldenRatioTypeScale({
      basePixels: input.basePixels as number,
      step: input.step as number,
    }),
});
export const goldenRatioTypeScaleTool = tool;
export const runGoldenRatioTypeScale = tool.execute;
export default tool;
