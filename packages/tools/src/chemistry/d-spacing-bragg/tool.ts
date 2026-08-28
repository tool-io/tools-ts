import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DSpacingBraggInput = {
  readonly braggAngleDegrees: number;
  readonly diffractionOrderN: number;
  readonly wavelengthAngstrom: number;
};

export type DSpacingBraggOutput = {
  readonly dSpacingAngstrom: number;
};

export const dSpacingBraggExample = {
  input: {
    braggAngleDegrees: 30,
    diffractionOrderN: 1,
    wavelengthAngstrom: 1.54,
  },
  output: { dSpacingAngstrom: 1.5400000000000003 },
} satisfies ToolExample<DSpacingBraggInput, DSpacingBraggOutput>;

export const calculateDSpacingBragg = (
  input: DSpacingBraggInput,
): DSpacingBraggOutput => {
  if (input.braggAngleDegrees <= 0 || input.braggAngleDegrees >= 90)
    simpleError(
      "braggAngleDegrees",
      "The Bragg angle must lie strictly between zero and ninety degrees.",
      "invalid_value",
    );
  if (input.wavelengthAngstrom <= 0)
    simpleError(
      "wavelengthAngstrom",
      "Wavelength must be positive.",
      "invalid_value",
    );
  return {
    dSpacingAngstrom:
      (input.diffractionOrderN * input.wavelengthAngstrom) /
      (2 * Math.sin((input.braggAngleDegrees * Math.PI) / 180)),
  };
};

export const DSpacingBraggTool = createSimpleTool({
  calculate: (input) =>
    calculateDSpacingBragg(input as unknown as DSpacingBraggInput),
  description:
    "Solve Bragg's law n*lambda = 2*d*sin(theta) for the interplanar spacing d in angstroms.",
  id: "chemistry/d-spacing-bragg",
  inputs: [
    {
      description: "Bragg diffraction angle theta measured from the plane.",
      id: "braggAngleDegrees",
      kind: "number",
      label: "Bragg angle",
      maximum: 90,
      minimum: 0,
      unit: "°",
    },
    {
      description: "Order of the reflection.",
      id: "diffractionOrderN",
      kind: "integer",
      label: "Diffraction order",
      minimum: 1,
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
      description: "Spacing between the reflecting lattice planes.",
      id: "dSpacingAngstrom",
      kind: "number",
      label: "d-spacing",
      unit: "Å",
    },
  ],
  title: "D-Spacing from Bragg's Law Calculator",
});
export const runDSpacingBragg = DSpacingBraggTool.execute;
export default DSpacingBraggTool;
