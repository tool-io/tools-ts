import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RamanStokesInput = {
  readonly pumpWavelengthNm: number;
  readonly stokesOrder: number;
};

export type RamanStokesOutput = {
  readonly stokesWavelengthNm: number;
  readonly shiftPerOrderCm: number;
};

/** Dominant silica Raman shift used for the Stokes cascade. */
export const SILICA_RAMAN_SHIFT_CM = 440;

const NM_PER_CM = 1e7;

/**
 * Cascaded Stokes wavelengths in silica fiber: each order downshifts the
 * wavenumber by ~440 cm^-1, so 1/λ_n = 1/λ_pump − n·440 cm^-1.
 */
export const ramanStokesWavelength = (
  input: RamanStokesInput,
): RamanStokesOutput => {
  const { pumpWavelengthNm, stokesOrder } = input;
  if (!Number.isFinite(pumpWavelengthNm) || pumpWavelengthNm <= 0)
    simpleError("pumpWavelengthNm", "Pump wavelength must be positive.");
  if (!Number.isSafeInteger(stokesOrder) || stokesOrder < 1)
    simpleError(
      "stokesOrder",
      "Stokes order must be an integer of at least 1.",
    );
  const pumpWavenumberCm =
    NM_PER_CM / pumpWavelengthNm - stokesOrder * SILICA_RAMAN_SHIFT_CM;
  if (!(pumpWavenumberCm > 0))
    simpleError(
      "stokesOrder",
      "This order shifts past zero wavenumber for the given pump.",
    );
  const stokesWavelengthNm = NM_PER_CM / pumpWavenumberCm;
  if (!Number.isFinite(stokesWavelengthNm))
    simpleError("pumpWavelengthNm", "Stokes wavelength overflowed.");
  return {
    stokesWavelengthNm,
    shiftPerOrderCm: SILICA_RAMAN_SHIFT_CM,
  };
};

export const ramanStokesExample = {
  input: { pumpWavelengthNm: 1064, stokesOrder: 1 },
  output: {
    stokesWavelengthNm: 1116.258770604626,
    shiftPerOrderCm: 440,
  },
} satisfies ToolExample<RamanStokesInput, RamanStokesOutput>;

export const ramanStokesTool = createSimpleTool({
  calculate: (input) =>
    ramanStokesWavelength({
      pumpWavelengthNm: input.pumpWavelengthNm as number,
      stokesOrder: input.stokesOrder as number,
    }),
  description:
    "Compute silica-fiber Raman Stokes wavelengths from a pump wavelength and integer cascade order using the 440 cm^-1 shift.",
  id: "laser/laser-raman-fiber-stokes-shift-wavelength-cascade-series-lookup",
  inputs: [
    {
      description: "Pump wavelength launching the cascade.",
      id: "pumpWavelengthNm",
      kind: "number",
      label: "Pump wavelength",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description:
        "Stokes order n = 1, 2, … (each step adds one 440 cm^-1 shift).",
      id: "stokesOrder",
      kind: "integer",
      label: "Stokes order",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Wavelength of the selected Stokes order.",
      id: "stokesWavelengthNm",
      kind: "number",
      label: "Stokes wavelength",
      unit: "nm",
    },
    {
      description: "Raman shift applied per order.",
      id: "shiftPerOrderCm",
      kind: "number",
      label: "Shift per order",
      unit: "cm^-1",
    },
  ],
  title: "Raman Stokes Cascade Wavelengths",
});
export const runRamanStokes = ramanStokesTool.execute;
export default ramanStokesTool;

export { ramanStokesExample as example };
