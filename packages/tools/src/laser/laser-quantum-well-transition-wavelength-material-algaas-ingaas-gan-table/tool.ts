import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuantumWellSystem =
  "algaas" | "ingaas-on-gaas" | "ingaasp-on-inp" | "ingan-gan";

export type QuantumWellWavelengthInput = {
  readonly system: QuantumWellSystem;
  readonly fraction: number;
};

export type QuantumWellWavelengthOutput = {
  readonly bandgapEv: number;
  readonly wavelengthNm: number;
  readonly strainOrLatticeNote: string;
};

const STRAIN_NOTES: Readonly<Record<QuantumWellSystem, string>> = {
  algaas: "Lattice matched to GaAs across all x (Δa/a ≈ 0.01%).",
  "ingaas-on-gaas":
    "Compressively strained on GaAs; keep the indium content times thickness below the critical limit.",
  "ingaasp-on-inp":
    "The Ga/In ratio is fixed by lattice matching to InP; the As/P ratio sets the band gap along that tie line.",
  "ingan-gan":
    "Strained on GaN; commercial LEDs stay below x ≈ 0.3 because quality degrades with indium.",
};

/** Direct-gap bowing relation for Al_xGa_{1-x}As (valid up to the Γ–X crossover). */
const algaasBandgapEv = (x: number): number => 1.424 + 1.247 * x;
/** Empirical strained In_xGa_{1-x}As on GaAs. */
const ingaasOnGaasBandgapEv = (x: number): number =>
  1.424 - 1.505 * x + 0.455 * x * x;
/** InP-lattice-matched In_xGa_{1-x}As_yP_{1-y} as a function of the arsenic fraction y. */
const ingaaspOnInpBandgapEv = (y: number): number =>
  1.35 - 0.72 * y + 0.12 * y * y;
/** In_xGa_{1-x}N with a 1.43 eV bowing parameter. */
const inganGanBandgapEv = (x: number): number =>
  3.42 * (1 - x) + 0.69 * x - 1.43 * x * (1 - x);

export const quantumWellWavelengthNm = (
  system: QuantumWellSystem,
  fraction: number,
): { bandgapEv: number; strainNote: string } => {
  if (fraction < 0 || fraction > 1)
    simpleError("fraction", "Composition fraction must lie between 0 and 1.");
  switch (system) {
    case "algaas":
      if (fraction > 0.45)
        simpleError(
          "fraction",
          "Above x ≈ 0.45 AlGaAs turns indirect — pick x ≤ 0.45 for lasing.",
          "indirect_crossover",
        );
      return {
        bandgapEv: algaasBandgapEv(fraction),
        strainNote: STRAIN_NOTES.algaas,
      };
    case "ingaas-on-gaas":
      return {
        bandgapEv: ingaasOnGaasBandgapEv(fraction),
        strainNote: STRAIN_NOTES["ingaas-on-gaas"],
      };
    case "ingaasp-on-inp":
      return {
        bandgapEv: ingaaspOnInpBandgapEv(fraction),
        strainNote: STRAIN_NOTES["ingaasp-on-inp"],
      };
    case "ingan-gan":
      return {
        bandgapEv: inganGanBandgapEv(fraction),
        strainNote: STRAIN_NOTES["ingan-gan"],
      };
  }
  return simpleError("system", "Choose one of the supported material systems.");
};

export const quantumWellWavelengthExample = {
  input: { system: "algaas", fraction: 0.3 },
  output: {
    bandgapEv: 1.7981,
    wavelengthNm: 1239.84 / 1.7981,
    strainOrLatticeNote: STRAIN_NOTES.algaas,
  },
} satisfies ToolExample<
  QuantumWellWavelengthInput,
  QuantumWellWavelengthOutput
>;

export const quantumWellWavelengthTool = createSimpleTool({
  calculate: (input) => {
    const result = quantumWellWavelengthNm(
      input.system as QuantumWellSystem,
      input.fraction as number,
    );
    return {
      bandgapEv: result.bandgapEv,
      wavelengthNm: 1239.84 / result.bandgapEv,
      strainOrLatticeNote: result.strainNote,
    };
  },
  description:
    "Estimate a bulk-alloy band gap and corresponding band-edge wavelength for common III–V compositions. This material-composition proxy omits quantum confinement, well thickness, strain-induced band shifts, and operating-temperature corrections required for a quantum-well transition design.",
  id: "laser/laser-quantum-well-transition-wavelength-material-algaas-ingaas-gan-table",
  inputs: [
    {
      description: "Epitaxial material system of the well.",
      enum: ["algaas", "ingaas-on-gaas", "ingaasp-on-inp", "ingan-gan"],
      id: "system",
      kind: "string",
      label: "Material system",
    },
    {
      description:
        "Composition fraction: Al in AlGaAs, In in InGaAs/GaN wells, or As in the InGaAsP quaternary.",
      id: "fraction",
      kind: "number",
      label: "Fraction",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Approximate bulk-alloy direct band gap for the selected composition.",
      id: "bandgapEv",
      kind: "number",
      label: "Band gap",
      unit: "eV",
    },
    {
      description:
        "Bulk band-edge wavelength calculated as hc/Eg, before confinement or strain corrections.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      unit: "nm",
    },
    {
      description: "Lattice or strain remark for the chosen system.",
      id: "strainOrLatticeNote",
      kind: "string",
      label: "Strain note",
    },
  ],
  title: "III–V Alloy Band-Edge Wavelength Proxy",
});
export const runQuantumWellWavelength = quantumWellWavelengthTool.execute;
export default quantumWellWavelengthTool;

export { quantumWellWavelengthExample as example };
