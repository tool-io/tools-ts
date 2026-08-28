import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LatticeEnergyMadelungInput = {
  readonly interionicDistanceNm: number;
  readonly madelungConstant?: number;
  readonly zPlusZMinusProduct: number;
};

export type LatticeEnergyMadelungOutput = {
  readonly latticeEnergyKJPerMol: number;
};

const MADELUNG_NACL = 1.7476;

export const latticeEnergyMadelungExample = {
  input: {
    interionicDistanceNm: 0.276,
    madelungConstant: 1.7476,
    zPlusZMinusProduct: 1,
  },
  output: { latticeEnergyKJPerMol: -879.7232052652174 },
} satisfies ToolExample<
  LatticeEnergyMadelungInput,
  LatticeEnergyMadelungOutput
>;

export const latticeEnergyMadelungTool = createSimpleTool({
  id: "chemistry/lattice-energy-madelung",
  title: "Lattice Energy Madelung",
  description:
    "Estimate electrostatic Madelung energy U = -138.935*A*|z+z-|/r for an ion pair, with interionic distance r in nanometres; short-range repulsion is not included.",
  inputs: [
    {
      id: "madelungConstant",
      label: "Madelung constant",
      kind: "number",
      required: false,
    },
    {
      id: "interionicDistanceNm",
      label: "Interionic distance",
      kind: "number",
      unit: "nm",
    },
    {
      id: "zPlusZMinusProduct",
      label: "Charge product z+ times z-",
      kind: "integer",
      maximum: 6,
      minimum: 1,
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
    const madelungConstant =
      (input.madelungConstant as number | undefined) ?? MADELUNG_NACL;
    const interionicDistanceNm = input.interionicDistanceNm as number;
    if (madelungConstant <= 0)
      simpleError("madelungConstant", "Madelung constant must be positive.");
    if (!(interionicDistanceNm > 0))
      simpleError("interionicDistanceNm", "Distance must be positive.");
    return {
      latticeEnergyKJPerMol:
        (-138.935457 *
          madelungConstant *
          (input.zPlusZMinusProduct as number)) /
        interionicDistanceNm,
    };
  },
});
export const runLatticeEnergyMadelung = latticeEnergyMadelungTool.execute;
export default latticeEnergyMadelungTool;
