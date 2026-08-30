import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly beamRadiusMillimeters: number;
  readonly absorberModeRadiusMillimeters: number;
  readonly maximumMismatchPercent: number;
}>;
export type Output = Readonly<{
  readonly radiusRatio: number;
  readonly mismatchPercent: number;
  readonly withinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.absorberModeRadiusMillimeters <= 0)
    simpleError(
      "absorberModeRadiusMillimeters",
      "Target radius must be positive.",
      "invalid_radius",
    );
  const radiusRatio =
    input.beamRadiusMillimeters / input.absorberModeRadiusMillimeters;
  const mismatchPercent = Math.abs(radiusRatio - 1) * 100;
  return {
    radiusRatio,
    mismatchPercent,
    withinTolerance: mismatchPercent <= input.maximumMismatchPercent,
  };
};

export const exampleInput = {
  beamRadiusMillimeters: 1,
  absorberModeRadiusMillimeters: 2,
  maximumMismatchPercent: 50,
} satisfies Input;
export const exampleOutput = {
  radiusRatio: 0.5,
  mismatchPercent: 50,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      beamRadiusMillimeters: input.beamRadiusMillimeters as number,
      absorberModeRadiusMillimeters:
        input.absorberModeRadiusMillimeters as number,
      maximumMismatchPercent: input.maximumMismatchPercent as number,
    }),
  description:
    "Compare the beam radius on a saturable absorber with a supplied target radius and tolerance.",
  id: "laser/saturable-absorber-spot-match",
  inputs: [
    {
      id: "beamRadiusMillimeters",
      label: "Beam radius on absorber",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "absorberModeRadiusMillimeters",
      label: "Absorber target radius",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "maximumMismatchPercent",
      label: "Maximum radius mismatch",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "radiusRatio",
      label: "Beam-to-target radius ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "mismatchPercent",
      label: "Absolute radius mismatch",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    { id: "withinTolerance", label: "Within tolerance", kind: "boolean" },
  ],
  title: "Saturable-Absorber Spot Match",
});

export const run = tool.execute;
export default tool;
