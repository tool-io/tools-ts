import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TheoreticalYieldInput = {
  readonly limitingMoles: number;
  readonly productMolarMassGPerMol: number;
  readonly stoichiometricFactor?: number;
};

export type TheoreticalYieldOutput = {
  readonly theoreticalYieldGrams: number;
};

export const theoreticalYieldExample = {
  input: { limitingMoles: 0.5, productMolarMassGPerMol: 180 },
  output: { theoreticalYieldGrams: 90 },
} satisfies ToolExample<TheoreticalYieldInput, TheoreticalYieldOutput>;

export const theoreticalYieldTool = createSimpleTool({
  id: "chemistry/theoretical-yield",
  title: "Theoretical Yield Calculator",
  description:
    "Compute the maximum product mass from the limiting reagent amount and product molar mass.",
  inputs: [
    {
      description: "Amount of the limiting reagent.",
      id: "limitingMoles",
      kind: "number",
      label: "Limiting moles",
      unit: "mol",
    },
    {
      description: "Molar mass of the product.",
      id: "productMolarMassGPerMol",
      kind: "number",
      label: "Product molar mass",
      unit: "g/mol",
    },
    {
      description:
        "Moles of product formed per mole of limiting reagent; zero or greater.",
      default: 1,
      id: "stoichiometricFactor",
      kind: "number",
      label: "Stoichiometric factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Maximum achievable product mass.",
      id: "theoreticalYieldGrams",
      kind: "number",
      label: "Theoretical yield",
      unit: "g",
    },
  ],
  calculate: (input) => {
    const limitingMoles = input.limitingMoles as number;
    if (!(limitingMoles > 0))
      simpleError(
        "limitingMoles",
        "The limiting amount must be greater than zero.",
      );
    const productMolarMassGPerMol = input.productMolarMassGPerMol as number;
    if (!(productMolarMassGPerMol > 0))
      simpleError(
        "productMolarMassGPerMol",
        "The product molar mass must be greater than zero.",
      );
    const stoichiometricFactor = input.stoichiometricFactor as number;
    return {
      theoreticalYieldGrams:
        limitingMoles * productMolarMassGPerMol * stoichiometricFactor,
    };
  },
});
export const runTheoreticalYield = theoreticalYieldTool.execute;
export default theoreticalYieldTool;
