import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const baseDissociationFractionTool = createSimpleTool({
  id: "chemistry/base-dissociation-fraction",
  title: "Base Dissociation Fraction Calculator",
  description:
    "Solve the exact dissociation fraction α of a weak base from Kb and concentration using Cα² + Kb·α − Kb = 0.",
  inputs: [
    {
      description: "Kb of the weak base; must be greater than zero.",
      id: "kb",
      label: "Kb",
      kind: "number",
    },
    {
      description:
        "Initial base concentration in mol/L; must be greater than zero.",
      id: "concentrationMolL",
      label: "Concentration",
      kind: "number",
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      description:
        "Fraction of base molecules dissociated, between zero and one.",
      id: "dissociationFraction",
      label: "Dissociation fraction",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const kb = input.kb as number;
    const concentration = input.concentrationMolL as number;
    if (kb <= 0 || concentration <= 0)
      simpleError(
        "kb",
        "Kb and the concentration must be greater than zero.",
        "invalid_kb_or_concentration",
      );
    const discriminant = Math.sqrt(kb * kb + 4 * concentration * kb);
    return { dissociationFraction: (discriminant - kb) / (2 * concentration) };
  },
});
export const runBaseDissociationFraction = baseDissociationFractionTool.execute;
export default baseDissociationFractionTool;

export type BaseDissociationFractionInput = {
  readonly kb: number;
  readonly concentrationMolL: number;
};

export type BaseDissociationFractionOutput = {
  readonly dissociationFraction: number;
};

export const baseDissociationFractionExample = {
  input: {
    kb: 1,
    concentrationMolL: 1,
  },
  output: {
    dissociationFraction: 0.6180339887498949,
  },
} satisfies ToolExample<
  BaseDissociationFractionInput,
  BaseDissociationFractionOutput
>;
