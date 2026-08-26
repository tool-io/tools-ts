import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type OsmoticPotentialInput = {
  readonly concentrationMolal: number;
  readonly vanthoffFactor?: number;
};

export type OsmoticPotentialOutput = {
  readonly osmoticPotentialMpa: number;
};

export const osmoticPotentialExample = {
  input: { concentrationMolal: 0.2 },
  output: { osmoticPotentialMpa: -0.4874 },
} satisfies ToolExample<OsmoticPotentialInput, OsmoticPotentialOutput>;

export const osmoticPotentialTool = createSimpleTool({
  id: "biology/osmotic-potential",
  title: "Osmotic Potential Van't Hoff",
  description:
    "Compute osmotic potential in megapascals with the van't Hoff relation as negative i times molal concentration times RT, using R*T = 2.437 MPa*L/mol at 293 K; the van't Hoff factor i defaults to one and may range from one to three.",
  inputs: [
    {
      description:
        "Solute concentration in moles per kilogram; must not be negative.",
      id: "concentrationMolal",
      kind: "number",
      label: "Concentration",
      minimum: 0,
      unit: "mol/kg",
    },
    {
      default: 1,
      description:
        "Van't Hoff ionization factor between 1 and 3; defaults to 1 for non-dissociating solutes.",
      id: "vanthoffFactor",
      kind: "number",
      label: "Van't Hoff factor",
      maximum: 3,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Osmotic potential in megapascals; zero or negative.",
      id: "osmoticPotentialMpa",
      kind: "number",
      label: "Osmotic potential",
      unit: "MPa",
    },
  ],
  calculate: (input) => {
    const concentrationMolal = input.concentrationMolal as number;
    const vanthoffFactor = input.vanthoffFactor as number;
    return {
      osmoticPotentialMpa: -(vanthoffFactor * concentrationMolal) * 2.437,
    };
  },
});
export const runOsmoticPotential = osmoticPotentialTool.execute;
export default osmoticPotentialTool;
