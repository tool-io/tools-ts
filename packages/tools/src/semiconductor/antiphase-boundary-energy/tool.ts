import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntiphaseBoundaryEnergyInput = {
  readonly apbEnergyEvPerAtom?: number;
  readonly atomDensityPerNm2?: number;
};

export type AntiphaseBoundaryEnergyOutput = {
  readonly boundaryEnergyMJPerM2: number;
};

const EV_PER_NM2_TO_MJ_PER_M2 = 160.2176634;

export const antiphaseBoundaryEnergyExample = {
  input: {},
  output: { boundaryEnergyMJPerM2: 54.474005556 },
} satisfies ToolExample<
  AntiphaseBoundaryEnergyInput,
  AntiphaseBoundaryEnergyOutput
>;

export const calculateAntiphaseBoundaryEnergy = (
  input: AntiphaseBoundaryEnergyInput,
): AntiphaseBoundaryEnergyOutput => {
  const apbEnergyEvPerAtom = input.apbEnergyEvPerAtom ?? 0.05;
  const atomDensityPerNm2 = input.atomDensityPerNm2 ?? 6.8;

  if (!Number.isFinite(apbEnergyEvPerAtom) || apbEnergyEvPerAtom < 0)
    simpleError(
      "apbEnergyEvPerAtom",
      "APB energy per atom must be a finite number at least 0.",
      "invalid_apb_energy",
    );

  if (!Number.isFinite(atomDensityPerNm2) || atomDensityPerNm2 <= 0)
    simpleError(
      "atomDensityPerNm2",
      "Atom density must be a finite positive number.",
      "invalid_atom_density",
    );

  // Normalize -0 to +0 for apbEnergy (allowed zero) to avoid -0 output
  const normalizedApb = apbEnergyEvPerAtom === 0 ? 0 : apbEnergyEvPerAtom;
  const normalizedDensity = atomDensityPerNm2 === 0 ? 0 : atomDensityPerNm2;

  // Handle apbEnergy 0 case explicitly to avoid -0 and preserve precision
  const directBoundaryEnergy =
    normalizedApb * normalizedDensity * EV_PER_NM2_TO_MJ_PER_M2;
  const boundaryEnergyMJPerM2 =
    normalizedApb === 0
      ? 0
      : Number.isFinite(directBoundaryEnergy) && directBoundaryEnergy > 0
        ? directBoundaryEnergy
        : Math.exp(
            Math.log(normalizedApb) +
              Math.log(normalizedDensity) +
              Math.log(EV_PER_NM2_TO_MJ_PER_M2),
          );

  if (
    !Number.isFinite(boundaryEnergyMJPerM2) ||
    (boundaryEnergyMJPerM2 === 0 && normalizedApb > 0)
  )
    simpleError(
      "atomDensityPerNm2",
      "Boundary energy is outside the representable positive range.",
      boundaryEnergyMJPerM2 === 0 ? "numeric_underflow" : "numeric_overflow",
    );

  return {
    boundaryEnergyMJPerM2:
      boundaryEnergyMJPerM2 === 0 ? 0 : boundaryEnergyMJPerM2,
  };
};

export const antiphaseBoundaryEnergyTool = createSimpleTool({
  calculate: (input) =>
    calculateAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: input.apbEnergyEvPerAtom as number | undefined,
      atomDensityPerNm2: input.atomDensityPerNm2 as number | undefined,
    }),
  description:
    "Calculate the antiphase boundary (APB) energy per unit area (mJ/m²) from the per-atom APB energy (eV/atom) and the planar atomic density (1/nm²). Model: E = apbEnergyPerAtom × atomDensity × 160.2176634 mJ·m⁻²/(eV·nm⁻²); assumes an ideal planar APB with uniform density. Per-area result is not the total boundary energy (multiply by area for total energy). apbEnergyEvPerAtom must be ≥0 eV (0 yields 0 mJ/m²); atomDensityPerNm2 must be >0 1/nm². No relaxation, segregation, or temperature dependence is included.",
  id: "semiconductor/antiphase-boundary-energy",
  inputs: [
    {
      default: 0.05,
      description:
        "Antiphase boundary formation energy per atom. Must be at least 0 eV; 0 yields 0 mJ/m².",
      id: "apbEnergyEvPerAtom",
      kind: "number",
      label: "APB energy per atom",
      minimum: 0,
      unit: "eV",
    },
    {
      default: 6.8,
      description:
        "Atomic density on the boundary plane. Must be greater than 0 1/nm².",
      id: "atomDensityPerNm2",
      kind: "number",
      label: "Atom density",
      minimum: Number.MIN_VALUE,
      unit: "1/nm²",
    },
  ],
  outputs: [
    {
      description:
        "Antiphase boundary energy per unit area. At least 0 mJ/m²; multiply by boundary area for total energy.",
      id: "boundaryEnergyMJPerM2",
      kind: "number",
      label: "Boundary energy",
      minimum: 0,
      unit: "mJ/m²",
    },
  ],
  title: "APB Energy Calculator",
});
export const runAntiphaseBoundaryEnergy = antiphaseBoundaryEnergyTool.execute;
export default antiphaseBoundaryEnergyTool;
