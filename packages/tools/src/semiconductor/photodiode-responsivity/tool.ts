import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PhotodiodeResponsivityInput = {
  readonly quantumEfficiencyPercent: number;
  readonly wavelengthNm: number;
};

export type PhotodiodeResponsivityOutput = {
  readonly responsivityAPerW: number;
};

const WAVELENGTH_ENERGY_PRODUCT_NM_EV = 1239.8419843320026;

export const photodiodeResponsivityExample = {
  input: {
    quantumEfficiencyPercent: 80,
    wavelengthNm: 620,
  },
  output: { responsivityAPerW: 0.4000509792925209 },
} satisfies ToolExample<
  PhotodiodeResponsivityInput,
  PhotodiodeResponsivityOutput
>;

export const photodiodeResponsivityTool = createSimpleTool({
  id: "semiconductor/photodiode-responsivity",
  title: "Photodiode Responsivity Calculator",
  description:
    "Compute photodiode responsivity from quantum efficiency and wavelength using R equals eta times lambda over 1240.",
  inputs: [
    {
      description: "External quantum efficiency.",
      id: "quantumEfficiencyPercent",
      kind: "number",
      label: "Quantum efficiency",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Vacuum wavelength of the incident light.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Photocurrent per unit incident optical power.",
      format: "responsivity",
      id: "responsivityAPerW",
      kind: "number",
      label: "Responsivity",
      minimum: 0,
      unit: "A/W",
    },
  ],
  calculate: (input) => ({
    responsivityAPerW:
      (((input.quantumEfficiencyPercent as number) / 100) *
        (input.wavelengthNm as number)) /
      WAVELENGTH_ENERGY_PRODUCT_NM_EV,
  }),
});
export const runPhotodiodeResponsivity = photodiodeResponsivityTool.execute;
export default photodiodeResponsivityTool;
