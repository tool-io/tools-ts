import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScherrerEquationInput = {
  readonly braggAngleDegrees: number;
  readonly fwhmRadians: number;
  readonly shapeFactorK: number;
  readonly wavelengthNm: number;
};

export type ScherrerEquationOutput = {
  readonly crystalliteSizeNm: number;
};

export const scherrerEquationExample = {
  input: {
    braggAngleDegrees: 15,
    fwhmRadians: 0.002,
    shapeFactorK: 0.9,
    wavelengthNm: 0.154,
  },
  output: { crystalliteSizeNm: 71.74463930241875 },
} satisfies ToolExample<ScherrerEquationInput, ScherrerEquationOutput>;

export const calculateScherrerEquation = (
  input: ScherrerEquationInput,
): ScherrerEquationOutput => {
  if (input.wavelengthNm <= 0)
    simpleError(
      "wavelengthNm",
      "Wavelength must be positive.",
      "invalid_value",
    );
  if (input.fwhmRadians <= 0)
    simpleError(
      "fwhmRadians",
      "The peak full width at half maximum must be positive.",
      "invalid_value",
    );
  if (input.shapeFactorK <= 0)
    simpleError(
      "shapeFactorK",
      "Shape factor must be positive.",
      "invalid_value",
    );
  if (input.braggAngleDegrees <= 0 || input.braggAngleDegrees >= 90)
    simpleError(
      "braggAngleDegrees",
      "The Bragg angle must lie strictly between zero and ninety degrees.",
      "invalid_value",
    );
  return {
    crystalliteSizeNm:
      (input.shapeFactorK * input.wavelengthNm) /
      (input.fwhmRadians * Math.cos((input.braggAngleDegrees * Math.PI) / 180)),
  };
};

export const ScherrerEquationTool = createSimpleTool({
  calculate: (input) =>
    calculateScherrerEquation(input as unknown as ScherrerEquationInput),
  description:
    "Estimate crystallite domain size with the Scherrer equation D = K*lambda/(beta*cos(theta)) from XRD peak broadening.",
  id: "chemistry/scherrer-equation",
  inputs: [
    {
      description: "Bragg angle theta of the analysed peak.",
      id: "braggAngleDegrees",
      kind: "number",
      label: "Bragg angle",
      maximum: 90,
      minimum: 0,
      unit: "°",
    },
    {
      description: "Peak full width at half maximum in radians.",
      id: "fwhmRadians",
      kind: "number",
      label: "Peak FWHM",
      minimum: 0,
      unit: "rad",
    },
    {
      description: "Dimensionless shape factor, commonly 0.9.",
      id: "shapeFactorK",
      kind: "number",
      label: "Shape factor",
      default: 0.9,
      minimum: 0,
    },
    {
      description: "X-ray wavelength in nanometres.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Crystallite size along the reflecting plane normal.",
      id: "crystalliteSizeNm",
      kind: "number",
      label: "Crystallite size",
      unit: "nm",
    },
  ],
  title: "Scherrer Equation Calculator",
});
export const runScherrerEquation = ScherrerEquationTool.execute;
export default ScherrerEquationTool;
