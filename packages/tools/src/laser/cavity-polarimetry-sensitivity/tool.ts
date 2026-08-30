import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cavityFinesse: number;
  readonly detectorNoiseVolts: number;
  readonly rotationSlopeVoltsPerRadian: number;
}>;
export type Output = Readonly<{
  readonly rotationEnhancementFactor: number;
  readonly minimumDetectableRotationRadians: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.rotationSlopeVoltsPerRadian <= 0)
    simpleError(
      "rotationSlopeVoltsPerRadian",
      "Polarimeter slope must be positive.",
      "invalid_slope",
    );
  const rotationEnhancementFactor = (2 * input.cavityFinesse) / Math.PI;
  if (rotationEnhancementFactor <= 0)
    simpleError(
      "cavityFinesse",
      "Finesse must be positive.",
      "invalid_finesse",
    );
  return {
    rotationEnhancementFactor,
    minimumDetectableRotationRadians:
      input.detectorNoiseVolts /
      (input.rotationSlopeVoltsPerRadian * rotationEnhancementFactor),
  };
};

export const exampleInput = {
  cavityFinesse: 1.5707963267948966,
  detectorNoiseVolts: 1,
  rotationSlopeVoltsPerRadian: 2,
} satisfies Input;
export const exampleOutput = {
  rotationEnhancementFactor: 1,
  minimumDetectableRotationRadians: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cavityFinesse: input.cavityFinesse as number,
      detectorNoiseVolts: input.detectorNoiseVolts as number,
      rotationSlopeVoltsPerRadian: input.rotationSlopeVoltsPerRadian as number,
    }),
  description:
    "Estimate cavity-enhanced polarimetry rotation sensitivity from finesse and detector noise.",
  id: "laser/cavity-polarimetry-sensitivity",
  inputs: [
    {
      id: "cavityFinesse",
      label: "Cavity finesse",
      kind: "number",
      minimum: 0,
    },
    {
      id: "detectorNoiseVolts",
      label: "Detector RMS noise",
      kind: "number",
      minimum: 0,
      unit: "V",
    },
    {
      id: "rotationSlopeVoltsPerRadian",
      label: "Polarimeter slope",
      kind: "number",
      minimum: 0,
      unit: "V/rad",
    },
  ],
  outputs: [
    {
      id: "rotationEnhancementFactor",
      label: "Rotation enhancement factor",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumDetectableRotationRadians",
      label: "Minimum detectable rotation",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
  ],
  title: "Cavity Polarimetry Sensitivity",
});

export const run = tool.execute;
export default tool;
