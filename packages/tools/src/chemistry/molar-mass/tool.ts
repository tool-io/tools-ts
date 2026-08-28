import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MolarMassInput = {
  readonly formulaWeight: number;
};

export type MolarMassOutput = {
  readonly molarMassGPerMol: number;
};

export const molarMassExample = {
  input: { formulaWeight: 18.015 },
  output: { molarMassGPerMol: 18.015 },
} satisfies ToolExample<MolarMassInput, MolarMassOutput>;

export const molarMassTool = createSimpleTool({
  id: "chemistry/molar-mass",
  title: "Molar Mass From Formula Weight",
  description:
    "Convert a formula weight into an equivalent molar mass in grams per mole.",
  inputs: [
    {
      description: "Formula weight of the substance.",
      id: "formulaWeight",
      kind: "number",
      label: "Formula weight",
      unit: "u",
    },
  ],
  outputs: [
    {
      description: "Molar mass numerically equal to the formula weight.",
      id: "molarMassGPerMol",
      kind: "number",
      label: "Molar mass",
      unit: "g/mol",
    },
  ],
  calculate: (input) => {
    const formulaWeight = input.formulaWeight as number;
    if (!(formulaWeight > 0))
      simpleError(
        "formulaWeight",
        "The formula weight must be greater than zero.",
      );
    return { molarMassGPerMol: formulaWeight };
  },
});
export const runMolarMass = molarMassTool.execute;
export default molarMassTool;
