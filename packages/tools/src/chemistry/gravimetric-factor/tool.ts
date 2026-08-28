import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GravimetricFactorInput = {
  readonly analyteMolarMass: number;
  readonly precipitateMolarMass: number;
  readonly stoichiometricRatio?: number;
};

export type GravimetricFactorOutput = {
  readonly gravimetricFactor: number;
};

export const gravimetricFactorExample = {
  input: { analyteMolarMass: 58.44, precipitateMolarMass: 143.32 },
} satisfies ToolExample<GravimetricFactorInput, GravimetricFactorOutput>;

export const gravimetricFactorTool = createSimpleTool({
  id: "chemistry/gravimetric-factor",
  title: "Gravimetric Factor",
  description:
    "Compute the gravimetric factor converting precipitate mass to analyte mass via molar mass ratio and stoichiometry.",
  inputs: [
    {
      id: "analyteMolarMass",
      label: "Analyte molar mass",
      kind: "number",
      unit: "g/mol",
    },
    {
      id: "precipitateMolarMass",
      label: "Precipitate molar mass",
      kind: "number",
      unit: "g/mol",
    },
    {
      id: "stoichiometricRatio",
      label: "Stoichiometric ratio",
      kind: "number",
      default: 1,
      unit: "mol analyte/mol precipitate",
    },
  ],
  outputs: [
    {
      id: "gravimetricFactor",
      label: "Gravimetric factor",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const analyteMolarMass = input.analyteMolarMass as number;
    const precipitateMolarMass = input.precipitateMolarMass as number;
    const stoichiometricRatio = input.stoichiometricRatio as number;
    if (!(analyteMolarMass > 0))
      simpleError("analyteMolarMass", "Analyte molar mass must be positive.");
    if (!(precipitateMolarMass > 0))
      simpleError(
        "precipitateMolarMass",
        "Precipitate molar mass must be positive.",
      );
    if (!(stoichiometricRatio > 0))
      simpleError(
        "stoichiometricRatio",
        "Stoichiometric ratio must be positive.",
      );
    return {
      gravimetricFactor:
        (analyteMolarMass / precipitateMolarMass) * stoichiometricRatio,
    };
  },
});
export const runGravimetricFactor = gravimetricFactorTool.execute;
export default gravimetricFactorTool;
