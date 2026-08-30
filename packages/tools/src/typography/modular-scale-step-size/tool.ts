import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ModularScaleStepSizeInput = Readonly<{
  readonly basePixels: number;
  readonly ratio: number;
  readonly step: number;
}>;
export type ModularScaleStepSizeOutput = Readonly<{
  readonly stepPixels: number;
}>;

export const calculateModularScaleStepSize = (
  x: ModularScaleStepSizeInput,
): ModularScaleStepSizeOutput => {
  if (!Number.isFinite(x.basePixels) || x.basePixels <= 0)
    simpleError("basePixels", "Provide a finite positive number.");
  if (!Number.isFinite(x.ratio) || x.ratio <= 0)
    simpleError("ratio", "Provide a finite positive number.");
  if (!Number.isFinite(x.step)) simpleError("step", "Provide a finite number.");
  if (!Number.isInteger(x.step))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const stepPixels = x.basePixels * x.ratio ** x.step;
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
    ratio: 1.25,
    step: 2,
  },
  output: { stepPixels: 25 },
} satisfies ToolExample<ModularScaleStepSizeInput, ModularScaleStepSizeOutput>;

export const tool = createSimpleTool({
  id: "typography/modular-scale-step-size",
  title: "Modular Scale Step Size",
  description:
    "Font size at an integer modular-scale step from a base size and positive ratio.",
  inputs: [
    {
      id: "basePixels",
      kind: "number",
      label: "Base Pixels",
      unit: "px",
      minimum: 0,
    },
    { id: "ratio", kind: "number", label: "Ratio", minimum: 0 },
    { id: "step", kind: "number", label: "Step" },
  ],
  outputs: [
    { id: "stepPixels", kind: "number", label: "Step Pixels", unit: "px" },
  ],
  calculate: (input) =>
    calculateModularScaleStepSize({
      basePixels: input.basePixels as number,
      ratio: input.ratio as number,
      step: input.step as number,
    }),
});
export const modularScaleStepSizeTool = tool;
export const runModularScaleStepSize = tool.execute;
export default tool;
