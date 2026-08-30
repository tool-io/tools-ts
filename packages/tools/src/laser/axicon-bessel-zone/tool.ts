import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly inputBeamRadiusMeters: number;
  readonly coneAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly besselZoneLengthMeters: number;
}>;

export const calculate = (input: Input): Output => {
  const tangent = Math.tan((input.coneAngleDegrees * Math.PI) / 180);
  if (tangent <= 0)
    simpleError(
      "coneAngleDegrees",
      "Cone angle must be positive.",
      "invalid_angle",
    );
  return { besselZoneLengthMeters: input.inputBeamRadiusMeters / tangent };
};

export const exampleInput = {
  inputBeamRadiusMeters: 0.005,
  coneAngleDegrees: 5,
} satisfies Input;
export const exampleOutput = {
  besselZoneLengthMeters: 0.05715026151380671,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      inputBeamRadiusMeters: input.inputBeamRadiusMeters as number,
      coneAngleDegrees: input.coneAngleDegrees as number,
    }),
  description:
    "Estimate geometric Bessel-zone length from beam radius and axicon cone angle.",
  id: "laser/axicon-bessel-zone",
  inputs: [
    {
      id: "inputBeamRadiusMeters",
      label: "Input beam radius",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "coneAngleDegrees",
      label: "Axicon cone angle",
      kind: "number",
      minimum: 0,
      maximum: 89.999,
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "besselZoneLengthMeters",
      label: "Geometric Bessel-zone length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  title: "Axicon Bessel Zone",
});

export const run = tool.execute;
export default tool;
