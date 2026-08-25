import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const NERNST_FACTOR_25C_MV = 59.16;

export type DonnanEquilibriumPotentialInput = {
  readonly chargeZ: number;
  readonly insideConcM: number;
  readonly outsideConcM: number;
};

export type DonnanEquilibriumPotentialOutput = {
  readonly donnanPotentialMV: number;
};

export const donnanEquilibriumPotentialExample = {
  input: { chargeZ: 1, insideConcM: 0.1, outsideConcM: 0.01 },
  output: { donnanPotentialMV: 59.16 },
} satisfies ToolExample<
  DonnanEquilibriumPotentialInput,
  DonnanEquilibriumPotentialOutput
>;

export const donnanEquilibriumPotentialTool = createSimpleTool({
  id: "biology/donnan-equilibrium-potential",
  title: "Donnan Potential",
  description:
    "Compute the equilibrium potential at 25 °C from the inside-to-outside concentration ratio. The base-10 Nernst factor is 59.16 mV per tenfold concentration gradient and is divided by ion valence.",
  inputs: [
    {
      id: "chargeZ",
      kind: "integer",
      label: "Valence z",
      maximum: 3,
      minimum: -3,
    },
    {
      id: "insideConcM",
      kind: "number",
      label: "Inside concentration",
      unit: "M",
    },
    {
      id: "outsideConcM",
      kind: "number",
      label: "Outside concentration",
      unit: "M",
    },
  ],
  outputs: [
    {
      description: "Signed potential in millivolts.",
      id: "donnanPotentialMV",
      kind: "number",
      label: "Donnan potential",
      unit: "mV",
    },
  ],
  calculate: (input) => {
    const chargeZ = input.chargeZ as number;
    const insideConcM = input.insideConcM as number;
    const outsideConcM = input.outsideConcM as number;
    if (chargeZ === 0)
      simpleError("chargeZ", "Ion valence must not be zero.", "zero_valence");
    if (!(insideConcM > 0))
      simpleError(
        "insideConcM",
        "The inside concentration must be greater than zero.",
      );
    if (!(outsideConcM > 0))
      simpleError(
        "outsideConcM",
        "The outside concentration must be greater than zero.",
      );
    return {
      donnanPotentialMV:
        (NERNST_FACTOR_25C_MV / chargeZ) *
        Math.log10(insideConcM / outsideConcM),
    };
  },
});
export const runDonnanEquilibriumPotential =
  donnanEquilibriumPotentialTool.execute;
export default donnanEquilibriumPotentialTool;
