import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CoreApertureMfdInput = {
  readonly coreRadiusUm: number;
  readonly wavelengthNm: number;
  readonly nCore: number;
  readonly nClad: number;
};

export type CoreApertureMfdOutput = {
  readonly numericalAperture: number;
  readonly vNumber: number;
  readonly modeFieldDiameterUm: number;
  readonly singleMode: boolean;
  readonly marcuseApproximationApplicable: boolean;
};

/**
 * Step-index fiber relations: NA = sqrt(nCore^2 - nClad^2),
 * V = 2·π·a·NA / λ, and the Marcuse Gaussian-spot approximation
 * MFD = 2·a·(0.65 + 1.619·V^-1.5 + 2.879·V^-6), valid near
 * single-mode operation (V ≲ 2.405).
 */
export const coreApertureMfd = (
  input: CoreApertureMfdInput,
): CoreApertureMfdOutput => {
  const { coreRadiusUm, wavelengthNm, nCore, nClad } = input;
  if (!Number.isFinite(nCore) || nCore <= 1)
    simpleError("nCore", "Core index must be a finite number above 1.");
  if (!Number.isFinite(nClad) || nClad <= 1)
    simpleError("nClad", "Cladding index must be a finite number above 1.");
  if (!(nCore > nClad))
    simpleError("nCore", "Core index must exceed the cladding index.");
  if (!Number.isFinite(coreRadiusUm) || coreRadiusUm <= 0)
    simpleError("coreRadiusUm", "Core radius must be positive.");
  if (!Number.isFinite(wavelengthNm) || wavelengthNm <= 0)
    simpleError("wavelengthNm", "Wavelength must be positive.");
  const numericalAperture = Math.sqrt((nCore - nClad) * (nCore + nClad));
  const vNumber =
    ((2 * Math.PI * coreRadiusUm * numericalAperture) / wavelengthNm) * 1000;
  if (!Number.isFinite(numericalAperture) || !Number.isFinite(vNumber))
    simpleError("nCore", "NA or V-number overflowed the numeric range.");
  const modeFieldDiameterUm =
    2 * coreRadiusUm * (0.65 + 1.619 * vNumber ** -1.5 + 2.879 * vNumber ** -6);
  if (!Number.isFinite(modeFieldDiameterUm))
    simpleError("coreRadiusUm", "Mode-field estimate overflowed.");
  return {
    numericalAperture,
    vNumber,
    modeFieldDiameterUm,
    singleMode: vNumber < 2.405,
    marcuseApproximationApplicable: vNumber >= 1.2 && vNumber <= 2.405,
  };
};

export const coreApertureMfdExample = {
  input: { coreRadiusUm: 4.5, wavelengthNm: 1550, nCore: 1.46, nClad: 1.455 },
  output: {
    numericalAperture: 0.12072696467649507,
    vNumber: 2.202241617974737,
    modeFieldDiameterUm: 10.53567261907322,
    singleMode: true,
    marcuseApproximationApplicable: true,
  },
} satisfies ToolExample<CoreApertureMfdInput, CoreApertureMfdOutput>;

export const coreApertureMfdTool = createSimpleTool({
  calculate: (input) =>
    coreApertureMfd({
      coreRadiusUm: input.coreRadiusUm as number,
      wavelengthNm: input.wavelengthNm as number,
      nCore: input.nCore as number,
      nClad: input.nClad as number,
    }),
  description:
    "Convert step-index fiber core/cladding indices, core radius, and wavelength into numerical aperture, V-number, and Marcuse mode-field diameter.",
  id: "laser/laser-core-numerical-aperture-mode-field-diameter-converter",
  inputs: [
    {
      description: "Core radius of the step-index fiber.",
      id: "coreRadiusUm",
      kind: "number",
      label: "Core radius",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      description: "Operating vacuum wavelength.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description: "Refractive index of the core (must exceed cladding).",
      id: "nCore",
      kind: "number",
      label: "n_core",
      minimum: 1.0000000000000002,
    },
    {
      description: "Refractive index of the cladding.",
      id: "nClad",
      kind: "number",
      label: "n_clad",
      minimum: 1.0000000000000002,
    },
  ],
  outputs: [
    {
      description: "Numerical aperture sqrt(nCore^2 - nClad^2).",
      id: "numericalAperture",
      kind: "number",
      label: "NA",
    },
    {
      description: "Normalized frequency V = 2π·a·NA/λ.",
      id: "vNumber",
      kind: "number",
      label: "V-number",
    },
    {
      description: "Marcuse Gaussian-spot mode-field diameter estimate.",
      id: "modeFieldDiameterUm",
      kind: "number",
      label: "MFD",
      unit: "µm",
    },
    {
      description: "True when V < 2.405 (single LP01 mode only).",
      id: "singleMode",
      kind: "boolean",
      label: "Single mode",
    },
    {
      description:
        "True in the commonly used 1.2 ≤ V ≤ 2.405 range of the Marcuse fit.",
      id: "marcuseApproximationApplicable",
      kind: "boolean",
      label: "Marcuse fit applicable",
    },
  ],
  title: "Fiber NA to Mode-Field Diameter Converter",
});
export const runCoreApertureMfd = coreApertureMfdTool.execute;
export default coreApertureMfdTool;

export { coreApertureMfdExample as example };
