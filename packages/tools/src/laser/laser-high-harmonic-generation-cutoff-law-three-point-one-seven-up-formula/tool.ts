import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HhgCutoffInput = {
  readonly ionizationPotentialEv: number;
  readonly intensityWPerCm2: number;
  readonly wavelengthUm: number;
};

export type HhgCutoffOutput = {
  readonly ponderomotiveEnergyEv: number;
  readonly cutoffEnergyEv: number;
  readonly cutoffWavelengthNm: number;
};

/** Up[eV] = 9.33e-14 · I[W/cm²] · λ[µm]² and photon hc in eV·nm. */
export const PONDEROMOTIVE_COEFF = 9.33e-14;
export const HC_EV_NM = 1239.842;

/**
 * Three-step-model high-harmonic cutoff: E_cutoff = Ip + 3.17·Up with
 * ponderomotive energy Up from the driving intensity and wavelength.
 */
export const hhgCutoff = (input: HhgCutoffInput): HhgCutoffOutput => {
  const { ionizationPotentialEv, intensityWPerCm2, wavelengthUm } = input;
  if (!Number.isFinite(ionizationPotentialEv) || ionizationPotentialEv <= 0)
    simpleError(
      "ionizationPotentialEv",
      "Ionization potential must be positive.",
    );
  if (!Number.isFinite(intensityWPerCm2) || intensityWPerCm2 <= 0)
    simpleError("intensityWPerCm2", "Driving intensity must be positive.");
  if (!Number.isFinite(wavelengthUm) || wavelengthUm <= 0)
    simpleError("wavelengthUm", "Driving wavelength must be positive.");
  const ponderomotiveEnergyEv =
    PONDEROMOTIVE_COEFF * intensityWPerCm2 * wavelengthUm * wavelengthUm;
  const cutoffEnergyEv = ionizationPotentialEv + 3.17 * ponderomotiveEnergyEv;
  if (
    !Number.isFinite(ponderomotiveEnergyEv) ||
    !Number.isFinite(cutoffEnergyEv)
  )
    simpleError("intensityWPerCm2", "Cutoff energy overflowed.");
  const cutoffWavelengthNm = HC_EV_NM / cutoffEnergyEv;
  if (!Number.isFinite(cutoffWavelengthNm))
    simpleError("ionizationPotentialEv", "Cutoff wavelength overflowed.");
  return { ponderomotiveEnergyEv, cutoffEnergyEv, cutoffWavelengthNm };
};

export const hhgCutoffExample = {
  input: {
    ionizationPotentialEv: 24.58,
    intensityWPerCm2: 2e14,
    wavelengthUm: 0.8,
  },
  output: {
    ponderomotiveEnergyEv: 11.942400000000001,
    cutoffEnergyEv: 62.437408,
    cutoffWavelengthNm: 19.857358588620464,
  },
} satisfies ToolExample<HhgCutoffInput, HhgCutoffOutput>;

export const hhgCutoffTool = createSimpleTool({
  calculate: (input) =>
    hhgCutoff({
      intensityWPerCm2: input.intensityWPerCm2 as number,
      ionizationPotentialEv: input.ionizationPotentialEv as number,
      wavelengthUm: input.wavelengthUm as number,
    }),
  description:
    "Estimate the single-atom high-harmonic cutoff from ionization potential, driving intensity, and wavelength via the three-step Ip + 3.17·Up law; propagation and phase matching are not modeled.",
  id: "laser/laser-high-harmonic-generation-cutoff-law-three-point-one-seven-up-formula",
  inputs: [
    {
      description:
        "Ionization potential of the generating gas (e.g. He 24.58 eV).",
      id: "ionizationPotentialEv",
      kind: "number",
      label: "Ip",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      description: "Peak driving intensity at focus.",
      id: "intensityWPerCm2",
      kind: "number",
      label: "Intensity",
      minimum: Number.MIN_VALUE,
      unit: "W/cm²",
    },
    {
      description: "Driving laser wavelength.",
      id: "wavelengthUm",
      kind: "number",
      label: "Wavelength",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
  ],
  outputs: [
    {
      description: "Ponderomotive energy of the driven electron.",
      id: "ponderomotiveEnergyEv",
      kind: "number",
      label: "Up",
      unit: "eV",
    },
    {
      description: "Cutoff photon energy Ip + 3.17·Up.",
      id: "cutoffEnergyEv",
      kind: "number",
      label: "Cutoff energy",
      unit: "eV",
    },
    {
      description: "Cutoff wavelength hc/E_cutoff.",
      id: "cutoffWavelengthNm",
      kind: "number",
      label: "Cutoff wavelength",
      unit: "nm",
    },
  ],
  title: "HHG Cutoff Law",
});
export const runHhgCutoff = hhgCutoffTool.execute;
export default hhgCutoffTool;

export { hhgCutoffExample as example };
