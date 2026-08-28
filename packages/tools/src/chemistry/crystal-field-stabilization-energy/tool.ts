import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrystalFieldStabilizationEnergyInput = {
  readonly egElectrons: number;
  readonly t2gElectrons: number;
};

export type CrystalFieldStabilizationEnergyOutput = {
  readonly cfseDeltaOUnits: number;
};

export const crystalFieldStabilizationEnergyExample = {
  input: { egElectrons: 0, t2gElectrons: 3 },
  output: { cfseDeltaOUnits: -1.2000000000000002 },
} satisfies ToolExample<
  CrystalFieldStabilizationEnergyInput,
  CrystalFieldStabilizationEnergyOutput
>;

export const calculateCrystalFieldStabilizationEnergy = (
  input: CrystalFieldStabilizationEnergyInput,
): CrystalFieldStabilizationEnergyOutput => {
  if (input.t2gElectrons < 0 || input.t2gElectrons > 6)
    simpleError(
      "t2gElectrons",
      "The octahedral t2g set holds at most six electrons.",
      "invalid_value",
    );
  if (input.egElectrons < 0 || input.egElectrons > 4)
    simpleError(
      "egElectrons",
      "The octahedral eg set holds at most four electrons.",
      "invalid_value",
    );
  return {
    cfseDeltaOUnits: -0.4 * input.t2gElectrons + 0.6 * input.egElectrons,
  };
};

export const CrystalFieldStabilizationEnergyTool = createSimpleTool({
  calculate: (input) =>
    calculateCrystalFieldStabilizationEnergy(
      input as unknown as CrystalFieldStabilizationEnergyInput,
    ),
  description:
    "Compute the octahedral crystal field stabilization energy in units of the ligand field splitting Delta-o from the t2g and eg electron counts: CFSE = (-0.4*n(t2g) + 0.6*n(eg)) * Delta-o.",
  id: "chemistry/crystal-field-stabilization-energy",
  inputs: [
    {
      description: "Electrons occupying the higher-energy eg orbitals.",
      id: "egElectrons",
      kind: "integer",
      label: "e-g electrons",
      maximum: 4,
      minimum: 0,
    },
    {
      description: "Electrons occupying the lower-energy t2g orbitals.",
      id: "t2gElectrons",
      kind: "integer",
      label: "t-2-g electrons",
      maximum: 6,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Stabilization energy in multiples of Delta-o; negative values are net stabilization.",
      id: "cfseDeltaOUnits",
      kind: "number",
      label: "CFSE",
      unit: "Δ₀",
    },
  ],
  title: "Crystal Field Stabilization Energy Calculator",
});
export const runCrystalFieldStabilizationEnergy =
  CrystalFieldStabilizationEnergyTool.execute;
export default CrystalFieldStabilizationEnergyTool;
