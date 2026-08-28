import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const latticeEnergyBornHaberTool = createSimpleTool({
  id: "chemistry/lattice-energy-born-haber",
  title: "Born-Haber Lattice Energy Calculator",
  description:
    "Solve the signed lattice formation enthalpy from a Born-Haber cycle, using a signed electron-attachment enthalpy (normally negative).",
  inputs: [
    {
      id: "formationEnthalpyKJPerMol",
      label: "dH formation",
      kind: "number",
      unit: "kJ/mol",
    },
    {
      id: "sublimationEnthalpyKJPerMol",
      label: "dH sublimation",
      kind: "number",
      unit: "kJ/mol",
    },
    {
      id: "ionizationEnergyKJPerMol",
      label: "IE",
      kind: "number",
      unit: "kJ/mol",
    },
    {
      id: "halfDissociationEnergyKJPerMol",
      label: "Half D(X2)",
      kind: "number",
      unit: "kJ/mol",
    },
    {
      id: "electronAttachmentEnthalpyKJPerMol",
      label: "Electron attachment enthalpy",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  outputs: [
    {
      id: "latticeEnergyKJPerMol",
      label: "Lattice energy",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    return {
      latticeEnergyKJPerMol:
        (input.formationEnthalpyKJPerMol as number) -
        (input.sublimationEnthalpyKJPerMol as number) -
        (input.halfDissociationEnergyKJPerMol as number) -
        (input.ionizationEnergyKJPerMol as number) -
        (input.electronAttachmentEnthalpyKJPerMol as number),
    };
  },
});
export default latticeEnergyBornHaberTool;
export const runLatticeEnergyBornHaber = latticeEnergyBornHaberTool.execute;

export type LatticeEnergyBornHaberInput = {
  readonly formationEnthalpyKJPerMol: number;
  readonly sublimationEnthalpyKJPerMol: number;
  readonly ionizationEnergyKJPerMol: number;
  readonly halfDissociationEnergyKJPerMol: number;
  readonly electronAttachmentEnthalpyKJPerMol: number;
};

export type LatticeEnergyBornHaberOutput = {
  readonly latticeEnergyKJPerMol: number;
};

export const latticeEnergyBornHaberExample = {
  input: {
    formationEnthalpyKJPerMol: -411,
    sublimationEnthalpyKJPerMol: 108,
    ionizationEnergyKJPerMol: 496,
    halfDissociationEnergyKJPerMol: 122,
    electronAttachmentEnthalpyKJPerMol: -349,
  },
  output: {
    latticeEnergyKJPerMol: -788,
  },
} satisfies ToolExample<
  LatticeEnergyBornHaberInput,
  LatticeEnergyBornHaberOutput
>;
