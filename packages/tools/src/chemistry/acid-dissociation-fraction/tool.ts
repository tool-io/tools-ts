import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const acidDissociationFractionTool = createSimpleTool({
  id: "chemistry/acid-dissociation-fraction",
  title: "Acid Dissociation Fraction Calculator",
  description:
    "Solve the exact dissociation fraction α of a weak acid from Ka and concentration using Cα² + Ka·α − Ka = 0.",
  inputs: [
    {
      description: "Ka of the weak acid; must be greater than zero.",
      id: "ka",
      label: "Ka",
      kind: "number",
    },
    {
      description:
        "Initial acid concentration in mol/L; must be greater than zero.",
      id: "concentrationMolL",
      label: "Concentration",
      kind: "number",
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      description:
        "Fraction of acid molecules dissociated, between zero and one.",
      id: "dissociationFraction",
      label: "Dissociation fraction",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const ka = input.ka as number;
    const concentration = input.concentrationMolL as number;
    if (ka <= 0 || concentration <= 0)
      simpleError(
        "ka",
        "Ka and the concentration must be greater than zero.",
        "invalid_ka_or_concentration",
      );
    const discriminant = Math.sqrt(ka * ka + 4 * concentration * ka);
    return { dissociationFraction: (discriminant - ka) / (2 * concentration) };
  },
});
export const runAcidDissociationFraction = acidDissociationFractionTool.execute;
export default acidDissociationFractionTool;

export type AcidDissociationFractionInput = {
  readonly ka: number;
  readonly concentrationMolL: number;
};

export type AcidDissociationFractionOutput = {
  readonly dissociationFraction: number;
};

export const acidDissociationFractionExample = {
  input: {
    ka: 1,
    concentrationMolL: 1,
  },
  output: {
    dissociationFraction: 0.6180339887498949,
  },
} satisfies ToolExample<
  AcidDissociationFractionInput,
  AcidDissociationFractionOutput
>;
