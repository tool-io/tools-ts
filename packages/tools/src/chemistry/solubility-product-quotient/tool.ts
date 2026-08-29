import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const solubilityProductQuotientTool = createSimpleTool({
  id: "chemistry/solubility-product-quotient",
  title: "Solubility Product Quotient Calculator",
  description:
    "Compute the reaction quotient Q = [A]ˣ[B]ʸ for a dissolving salt and compare it against Ksp.",
  inputs: [
    {
      description: "Cation concentration in mol/L.",
      id: "cationConcentrationMolL",
      label: "Cation concentration",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      description: "Anion concentration in mol/L.",
      id: "anionConcentrationMolL",
      label: "Anion concentration",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      description: "Stoichiometric coefficient of the cation.",
      id: "cationCoeff",
      label: "Cation coefficient",
      kind: "integer",
      minimum: 1,
    },
    {
      description: "Stoichiometric coefficient of the anion.",
      id: "anionCoeff",
      label: "Anion coefficient",
      kind: "integer",
      minimum: 1,
    },
    {
      description: "Solubility product constant.",
      id: "ksp",
      label: "Ksp",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Ion product quotient Q.",
      id: "quotient",
      label: "Q",
      kind: "number",
    },
    {
      description: "One of unsaturated, saturated, or supersaturated.",
      id: "state",
      label: "Saturation state",
      kind: "string",
    },
  ],
  calculate: (input) => {
    const quotient =
      (input.cationConcentrationMolL as number) **
        (input.cationCoeff as number) *
      (input.anionConcentrationMolL as number) ** (input.anionCoeff as number);
    const ksp = input.ksp as number;
    const state =
      quotient < ksp
        ? "unsaturated"
        : quotient === ksp
          ? "saturated"
          : "supersaturated";
    return { quotient, state };
  },
});
export const runSolubilityProductQuotient =
  solubilityProductQuotientTool.execute;
export default solubilityProductQuotientTool;

export type SolubilityProductQuotientInput = {
  readonly cationConcentrationMolL: number;
  readonly anionConcentrationMolL: number;
  readonly cationCoeff: number;
  readonly anionCoeff: number;
  readonly ksp: number;
};

export type SolubilityProductQuotientOutput = {
  readonly quotient: number;
  readonly state: string;
};

export const solubilityProductQuotientExample = {
  input: {
    cationConcentrationMolL: 1,
    anionConcentrationMolL: 1,
    cationCoeff: 1,
    anionCoeff: 1,
    ksp: 1,
  },
  output: {
    quotient: 1,
    state: "saturated",
  },
} satisfies ToolExample<
  SolubilityProductQuotientInput,
  SolubilityProductQuotientOutput
>;
