import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly wavelengthMeters: number;
  readonly gratingPeriodMeters: number;
  readonly diffractionOrder: number;
  readonly incidenceAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly diffractedAngleDegrees: number;
  readonly physicalOrder: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.gratingPeriodMeters <= 0)
    simpleError(
      "gratingPeriodMeters",
      "Grating period must be positive.",
      "invalid_period",
    );
  const argument =
    (input.diffractionOrder * input.wavelengthMeters) /
      input.gratingPeriodMeters -
    Math.sin((input.incidenceAngleDegrees * Math.PI) / 180);
  if (Math.abs(argument) > 1)
    return { diffractedAngleDegrees: 0, physicalOrder: false };
  return {
    diffractedAngleDegrees: (Math.asin(argument) * 180) / Math.PI,
    physicalOrder: true,
  };
};

export const exampleInput = {
  wavelengthMeters: 5e-7,
  gratingPeriodMeters: 1e-6,
  diffractionOrder: 1,
  incidenceAngleDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  diffractedAngleDegrees: 30.000000000000004,
  physicalOrder: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      wavelengthMeters: input.wavelengthMeters as number,
      gratingPeriodMeters: input.gratingPeriodMeters as number,
      diffractionOrder: input.diffractionOrder as number,
      incidenceAngleDegrees: input.incidenceAngleDegrees as number,
    }),
  description: "Solve the scalar grating equation for diffraction angle.",
  id: "laser/grating-steering-angle",
  inputs: [
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "gratingPeriodMeters",
      label: "Grating period",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    { id: "diffractionOrder", label: "Diffraction order", kind: "integer" },
    {
      id: "incidenceAngleDegrees",
      label: "Incidence angle",
      kind: "number",
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "diffractedAngleDegrees",
      label: "Diffracted angle",
      kind: "number",
      unit: "°",
    },
    {
      id: "physicalOrder",
      label: "Physical diffraction order",
      kind: "boolean",
    },
  ],
  title: "Grating Steering Angle",
});

export const run = tool.execute;
export default tool;
