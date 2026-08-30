import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PerfectFourthScaleGeneratorInput = Readonly<{
  readonly basePixels: number;
  readonly step: number;
}>;
export type PerfectFourthScaleGeneratorOutput = Readonly<{
  readonly stepPixels: number;
}>;

export const calculatePerfectFourthScaleGenerator = (
  x: PerfectFourthScaleGeneratorInput,
): PerfectFourthScaleGeneratorOutput => {
  if (!Number.isFinite(x.basePixels) || x.basePixels <= 0)
    simpleError("basePixels", "Provide a finite positive number.");
  if (!Number.isFinite(x.step)) simpleError("step", "Provide a finite number.");
  if (!Number.isInteger(x.step))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const stepPixels = x.basePixels * (4 / 3) ** x.step;
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
  output: { stepPixels: 21.333333333333332 },
} satisfies ToolExample<
  PerfectFourthScaleGeneratorInput,
  PerfectFourthScaleGeneratorOutput
>;

export const tool = createSimpleTool({
  id: "typography/perfect-fourth-scale-generator",
  title: "Perfect Fourth Scale Generator",
  description:
    "Font size at an integer scale step using the musical perfect-fourth ratio 4:3.",
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
    calculatePerfectFourthScaleGenerator({
      basePixels: input.basePixels as number,
      step: input.step as number,
    }),
});
export const perfectFourthScaleGeneratorTool = tool;
export const runPerfectFourthScaleGenerator = tool.execute;
export default tool;
