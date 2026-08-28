import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RedoxEquivalentWeightInput = {
  readonly electronChangeInt: number;
  readonly molarMassGPerMol: number;
};

export type RedoxEquivalentWeightOutput = {
  readonly equivalentWeightG: number;
};

export const redoxEquivalentWeightExample = {
  input: { molarMassGPerMol: 63.55, electronChangeInt: 2 },
  output: { equivalentWeightG: 31.775 },
} satisfies ToolExample<
  RedoxEquivalentWeightInput,
  RedoxEquivalentWeightOutput
>;

export const redoxEquivalentWeightTool = createSimpleTool({
  id: "chemistry/redox-equivalent-weight",
  title: "Redox Equivalent Weight",
  description:
    "Compute the redox equivalent weight as molar mass divided by the number of electrons transferred per formula unit.",
  inputs: [
    {
      id: "molarMassGPerMol",
      label: "Molar mass",
      kind: "number",
      unit: "g/mol",
    },
    {
      id: "electronChangeInt",
      label: "Electrons transferred",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "equivalentWeightG",
      label: "Equivalent weight",
      kind: "number",
      unit: "g",
    },
  ],
  calculate: (input) => {
    const molarMassGPerMol = input.molarMassGPerMol as number;
    if (!(molarMassGPerMol > 0))
      simpleError(
        "molarMassGPerMol",
        "Molar mass must be positive.",
        "invalid_mass",
      );
    return {
      equivalentWeightG: molarMassGPerMol / (input.electronChangeInt as number),
    };
  },
});
export const runRedoxEquivalentWeight = redoxEquivalentWeightTool.execute;
export default redoxEquivalentWeightTool;
