import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DepthOfFocusInput = {
  readonly wavelengthNm: number;
  readonly numericalAperture: number;
  readonly k2Factor: number;
};

export type DepthOfFocusOutput = {
  readonly depthOfFocusNm: number;
};

export const depthOfFocusExample = {
  input: { k2Factor: 0.5, numericalAperture: 0.75, wavelengthNm: 193 },
  output: { depthOfFocusNm: 171.55555555555554 },
} satisfies ToolExample<DepthOfFocusInput, DepthOfFocusOutput>;

export const depthOfFocusTool = createSimpleTool({
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
      depthOfFocusNm:
        ((input.k2Factor as number) * wavelengthNm) /
        (numericalAperture * numericalAperture),
    };
  },
  description:
    "Compute the lithographic depth of focus from the k2 factor, exposure wavelength, and numerical aperture.",
  id: "semiconductor/lithography-depth-of-focus",
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
      description: "Process-dependent k2 factor.",
      id: "k2Factor",
      kind: "number",
      label: "k2 factor",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Depth of focus of the aerial image.",
      id: "depthOfFocusNm",
      kind: "number",
      label: "Depth of focus",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  title: "Depth of Focus Calculator",
});
export const runDepthOfFocus = depthOfFocusTool.execute;
export default depthOfFocusTool;
