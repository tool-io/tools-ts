import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhotodiodeResponsivityInput = {
  readonly quantumEfficiencyPercent: number;
  readonly wavelengthNm: number;
};

export type PhotodiodeResponsivityOutput = {
  readonly responsivityAPerW: number;
};

export const photodiodeResponsivityExample = {
  input: { quantumEfficiencyPercent: 80, wavelengthNm: 1550 },
  output: { responsivityAPerW: 1 },
} satisfies ToolExample<
  PhotodiodeResponsivityInput,
  PhotodiodeResponsivityOutput
>;

export const calculatePhotodiodeResponsivity = (
  input: PhotodiodeResponsivityInput,
): PhotodiodeResponsivityOutput => {
  if (
    !(input.quantumEfficiencyPercent >= 0) ||
    !(input.quantumEfficiencyPercent <= 100)
  )
    simpleError(
      "quantumEfficiencyPercent",
      "Quantum efficiency must be between zero and one hundred percent.",
      "invalid_efficiency",
    );
  if (!(input.wavelengthNm > 100) || !(input.wavelengthNm < 2000))
    simpleError(
      "wavelengthNm",
      "Wavelength must be greater than 100 nm and less than 2000 nm.",
      "invalid_wavelength",
    );
  return {
    responsivityAPerW:
      ((input.quantumEfficiencyPercent / 100) * input.wavelengthNm) / 1240,
  };
};

export const photodiodeResponsivityTool = createSimpleTool({
  calculate: (input) =>
    calculatePhotodiodeResponsivity(
      input as unknown as PhotodiodeResponsivityInput,
    ),
  description:
    "Compute photodiode responsivity in A/W from quantum efficiency and wavelength.",
  id: "electronics/photodiode-responsivity",
  inputs: [
    {
      description: "Photodetector quantum efficiency.",
      format: "percent",
      id: "quantumEfficiencyPercent",
      kind: "number",
      label: "Quantum efficiency",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Wavelength of the incident light.",
      format: "length",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Current produced per watt of optical power.",
      format: "responsivity",
      id: "responsivityAPerW",
      kind: "number",
      label: "Responsivity",
      unit: "A/W",
    },
  ],
  title: "Photodiode Responsivity (Electronics)",
});
export const runPhotodiodeResponsivity = photodiodeResponsivityTool.execute;
export default photodiodeResponsivityTool;
