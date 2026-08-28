import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BraggAngleInput = {
  readonly diffractionOrderN: number;
  readonly dSpacingAngstrom: number;
  readonly wavelengthAngstrom: number;
};

export type BraggAngleOutput = {
  readonly braggAngleDegrees: number;
};

export const braggAngleExample = {
  input: {
    diffractionOrderN: 1,
    dSpacingAngstrom: 2.5,
    wavelengthAngstrom: 1.54,
  },
  output: { braggAngleDegrees: 17.938742465547797 },
} satisfies ToolExample<BraggAngleInput, BraggAngleOutput>;

export const calculateBraggAngle = (
  input: BraggAngleInput,
): BraggAngleOutput => {
  if (input.wavelengthAngstrom <= 0)
    simpleError(
      "wavelengthAngstrom",
      "Wavelength must be positive.",
      "invalid_value",
    );
  if (input.dSpacingAngstrom <= 0)
    simpleError(
      "dSpacingAngstrom",
      "Interplanar spacing must be positive.",
      "invalid_value",
    );
  const sinTheta =
    (input.diffractionOrderN * input.wavelengthAngstrom) /
    (2 * input.dSpacingAngstrom);
  if (sinTheta > 1)
    simpleError(
      "diffractionOrderN",
      "No solution exists when n times the wavelength exceeds twice the plane spacing.",
      "invalid_value",
    );
  return { braggAngleDegrees: (Math.asin(sinTheta) * 180) / Math.PI };
};

export const BraggAngleTool = createSimpleTool({
  calculate: (input) =>
    calculateBraggAngle(input as unknown as BraggAngleInput),
  description:
    "Solve Bragg's law n*lambda = 2*d*sin(theta) for the diffraction angle theta in degrees.",
  id: "chemistry/bragg-angle",
  inputs: [
    {
      description: "Order of the reflection.",
      id: "diffractionOrderN",
      kind: "integer",
      label: "Diffraction order",
      minimum: 1,
    },
    {
      description: "Spacing between lattice planes in angstroms.",
      id: "dSpacingAngstrom",
      kind: "number",
      label: "d-spacing",
      minimum: 0,
      unit: "Å",
    },
    {
      description: "X-ray wavelength in angstroms.",
      id: "wavelengthAngstrom",
      kind: "number",
      label: "Wavelength",
      minimum: 0,
      unit: "Å",
    },
  ],
  outputs: [
    {
      description: "Bragg diffraction angle theta from the normal.",
      id: "braggAngleDegrees",
      kind: "number",
      label: "Bragg angle",
      unit: "°",
    },
  ],
  title: "Bragg Angle Calculator",
});
export const runBraggAngle = BraggAngleTool.execute;
export default BraggAngleTool;
