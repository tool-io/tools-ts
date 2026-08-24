import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RayleighResolutionInput = {
  readonly wavelengthNm: number;
  readonly numericalAperture: number;
  readonly k1Factor: number;
};

export type RayleighResolutionOutput = {
  readonly resolutionNm: number;
};

export const rayleighResolutionExample = {
  input: { k1Factor: 0.4, numericalAperture: 0.75, wavelengthNm: 193 },
  output: { resolutionNm: 102.93333333333334 },
} satisfies ToolExample<RayleighResolutionInput, RayleighResolutionOutput>;

export const rayleighResolutionTool = createSimpleTool({
  calculate: (input) => {
    const wavelengthNm = input.wavelengthNm as number;
    const numericalAperture = input.numericalAperture as number;
    if (wavelengthNm <= 0)
      simpleError(
        "wavelengthNm",
        "Wavelength must be positive.",
        "degenerate_input",
      );
    if (numericalAperture <= 0)
      simpleError(
        "numericalAperture",
        "Numerical aperture must be positive.",
        "degenerate_input",
      );
    return {
      resolutionNm:
        ((input.k1Factor as number) * wavelengthNm) / numericalAperture,
    };
  },
  description:
    "Compute the Rayleigh lithographic resolution from the k1 factor, exposure wavelength, and numerical aperture.",
  id: "semiconductor/lithography-resolution-rayleigh",
  inputs: [
    {
      description: "Exposure wavelength of the lithography system.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description: "Numerical aperture of the projection optics.",
      id: "numericalAperture",
      kind: "number",
      label: "Numerical aperture",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Process-dependent k1 factor.",
      id: "k1Factor",
      kind: "number",
      label: "k1 factor",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Minimum resolvable feature size.",
      id: "resolutionNm",
      kind: "number",
      label: "Resolution",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  title: "Rayleigh Resolution Calculator",
});
export const runRayleighResolution = rayleighResolutionTool.execute;
export default rayleighResolutionTool;
