import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const ElectrochemicalEquivalentTool = createSimpleTool({
  id: "chemistry/electrochemical-equivalent",
  title: "Electrochemical Equivalent Calculator",
  description: "Compute electrochemical equivalent Z = M/(n*F) g/C.",
  inputs: [
    {
      id: "molarMassGMol",
      label: "Molar mass",
      kind: "number",
      minimum: 0,
      unit: "g/mol",
    },
    {
      id: "valence",
      label: "Valence",
      kind: "integer",
      description: "Electrons; nonzero.",
    },
  ],
  outputs: [
    {
      id: "electrochemicalEquivalentGMolC",
      label: "Z",
      kind: "number",
      unit: "g/C",
    },
  ],
  calculate: (input) => {
    const electronCount = input.valence as number;
    if (!(electronCount > 0))
      simpleError(
        "valence",
        "Electron count must be greater than zero.",
        "invalid_valence",
      );
    return {
      electrochemicalEquivalentGMolC:
        (input.molarMassGMol as number) / (electronCount * 96485.33212),
    };
  },
});
export default ElectrochemicalEquivalentTool;
export const runElectrochemicalEquivalent =
  ElectrochemicalEquivalentTool.execute;

export type ElectrochemicalEquivalentInput = {
  readonly molarMassGMol: number;
  readonly valence: number;
};

export type ElectrochemicalEquivalentOutput = {
  readonly electrochemicalEquivalentGMolC: number;
};

export const electrochemicalEquivalentExample = {
  input: {
    molarMassGMol: 1,
    valence: 1,
  },
  output: {
    electrochemicalEquivalentGMolC: 0.000010364269656617728,
  },
} satisfies ToolExample<
  ElectrochemicalEquivalentInput,
  ElectrochemicalEquivalentOutput
>;
