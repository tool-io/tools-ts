import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RayleighRangeInput = {
  readonly waistRadiusUm: number;
  readonly wavelengthNm: number;
};

export type RayleighRangeOutput = {
  readonly rayleighRangeMm: number;
  readonly confocalParameterMm: number;
};

/**
 * Gaussian-beam Rayleigh range zR = π·w0²/λ with confocal parameter
 * b = 2·zR, the full axial extent of the near-collimated waist region.
 */
export const rayleighRange = (
  input: RayleighRangeInput,
): RayleighRangeOutput => {
  const { waistRadiusUm, wavelengthNm } = input;
  if (!Number.isFinite(waistRadiusUm) || waistRadiusUm <= 0)
    simpleError("waistRadiusUm", "Waist radius must be positive.");
  if (!Number.isFinite(wavelengthNm) || wavelengthNm <= 0)
    simpleError("wavelengthNm", "Wavelength must be positive.");
  const rayleighRangeMm =
    (Math.PI * waistRadiusUm * waistRadiusUm) / wavelengthNm;
  if (!Number.isFinite(rayleighRangeMm))
    simpleError("waistRadiusUm", "Rayleigh range overflowed.");
  const confocalParameterMm = 2 * rayleighRangeMm;
  if (!Number.isFinite(confocalParameterMm))
    simpleError("waistRadiusUm", "Confocal parameter overflowed.");
  return { rayleighRangeMm, confocalParameterMm };
};

export const rayleighRangeExample = {
  input: { waistRadiusUm: 100, wavelengthNm: 1064 },
  output: {
    rayleighRangeMm: 29.526246744264974,
    confocalParameterMm: 59.05249348852995,
  },
} satisfies ToolExample<RayleighRangeInput, RayleighRangeOutput>;

export const rayleighRangeTool = createSimpleTool({
  calculate: (input) =>
    rayleighRange({
      waistRadiusUm: input.waistRadiusUm as number,
      wavelengthNm: input.wavelengthNm as number,
    }),
  description:
    "Compute the Gaussian-beam Rayleigh range and confocal parameter from waist radius and wavelength.",
  id: "laser/laser-rayleigh-range-confocal-parameter-waist-distance-formula",
  inputs: [
    {
      description: "Beam waist (1/e²) radius.",
      id: "waistRadiusUm",
      kind: "number",
      label: "Waist radius",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      description: "Laser wavelength.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Rayleigh range π·w0²/λ.",
      id: "rayleighRangeMm",
      kind: "number",
      label: "Rayleigh range",
      unit: "mm",
    },
    {
      description: "Confocal parameter 2·zR.",
      id: "confocalParameterMm",
      kind: "number",
      label: "Confocal parameter",
      unit: "mm",
    },
  ],
  title: "Rayleigh Range Formula",
});
export const runRayleighRange = rayleighRangeTool.execute;
export default rayleighRangeTool;

export { rayleighRangeExample as example };
