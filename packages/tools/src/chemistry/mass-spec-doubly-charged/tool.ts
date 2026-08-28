import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const PROTON_MASS_DA = 1.007276;

export type MassSpecDoublyChargedInput = {
  readonly massDa: number;
};

export type MassSpecDoublyChargedOutput = {
  readonly doublyChargedMz: number;
};

export const massSpecDoublyChargedExample = {
  input: { massDa: 180 },
  output: { doublyChargedMz: 91.007276 },
} satisfies ToolExample<
  MassSpecDoublyChargedInput,
  MassSpecDoublyChargedOutput
>;

export const massSpecDoublyChargedTool = createSimpleTool({
  id: "chemistry/mass-spec-doubly-charged",
  title: "Doubly Charged m/z",
  description:
    "Compute the mass-to-charge ratio of a doubly charged ion as the neutral mass plus two proton masses divided by two.",
  inputs: [{ id: "massDa", label: "Neutral mass", kind: "number", unit: "Da" }],
  outputs: [
    {
      id: "doublyChargedMz",
      label: "Doubly charged m/z",
      kind: "number",
      unit: "m/z",
    },
  ],
  calculate: (input) => {
    const massDa = input.massDa as number;
    if (!(massDa > 0))
      simpleError("massDa", "Neutral mass must be positive.", "invalid_mass");
    return { doublyChargedMz: (massDa + 2 * PROTON_MASS_DA) / 2 };
  },
});
export const runMassSpecDoublyCharged = massSpecDoublyChargedTool.execute;
export default massSpecDoublyChargedTool;
