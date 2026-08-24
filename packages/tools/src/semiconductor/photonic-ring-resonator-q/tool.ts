import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RingResonatorQInput = {
  readonly fwhmNm: number;
  readonly resonanceWavelengthNm: number;
};

export type RingResonatorQOutput = {
  readonly qualityFactor: number;
};

export const ringResonatorQExample = {
  input: { fwhmNm: 0.5, resonanceWavelengthNm: 1550 },
  output: { qualityFactor: 3100 },
} satisfies ToolExample<RingResonatorQInput, RingResonatorQOutput>;

export const ringResonatorQTool = createSimpleTool({
  calculate: (input) => {
    const wavelength = input.resonanceWavelengthNm as number;
    const fwhm = input.fwhmNm as number;
    if (!(wavelength > 0))
      simpleError(
        "resonanceWavelengthNm",
        "Resonance wavelength must be positive.",
        "invalid_wavelength",
      );
    if (!(fwhm > 0))
      simpleError("fwhmNm", "Linewidth must be positive.", "invalid_fwhm");
    return { qualityFactor: wavelength / fwhm };
  },
  description:
    "Compute the quality factor of an optical ring resonator from its resonance wavelength and full-width half-maximum linewidth.",
  id: "semiconductor/photonic-ring-resonator-q",
  inputs: [
    {
      id: "fwhmNm",
      kind: "number",
      label: "Linewidth (FWHM)",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      id: "resonanceWavelengthNm",
      kind: "number",
      label: "Resonance wavelength",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "qualityFactor",
      kind: "number",
      label: "Quality factor",
      minimum: Number.MIN_VALUE,
    },
  ],
  title: "Ring Resonator Q Factor Calculator",
});
export const runRingResonatorQ = ringResonatorQTool.execute;
export default ringResonatorQTool;
