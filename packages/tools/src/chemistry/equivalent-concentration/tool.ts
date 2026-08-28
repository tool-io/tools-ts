import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const equivalentConcentrationTool = createSimpleTool({
  id: "chemistry/equivalent-concentration",
  title: "Equivalent Concentration Calculator",
  description:
    "Compute the equivalent concentration of a solution as equivalents divided by liters of solution.",
  inputs: [
    {
      description: "Equivalents of solute dissolved.",
      id: "equivalents",
      label: "Equivalents",
      kind: "number",
      minimum: 0,
      unit: "eq",
    },
    {
      description: "Solution volume; must be greater than zero.",
      id: "volumeLiters",
      label: "Volume",
      kind: "number",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Equivalent concentration in equivalents per liter.",
      id: "eqPerLiter",
      label: "Equivalent concentration",
      kind: "number",
      unit: "N",
    },
  ],
  calculate: (input) => {
    const volume = input.volumeLiters as number;
    if (volume <= 0)
      simpleError(
        "volumeLiters",
        "The volume must be greater than zero liters.",
        "invalid_volume",
      );
    return { eqPerLiter: (input.equivalents as number) / volume };
  },
});
export const runEquivalentConcentration = equivalentConcentrationTool.execute;
export default equivalentConcentrationTool;

export type EquivalentConcentrationInput = {
  readonly equivalents: number;
  readonly volumeLiters: number;
};

export type EquivalentConcentrationOutput = {
  readonly eqPerLiter: number;
};

export const equivalentConcentrationExample = {
  input: {
    equivalents: 1,
    volumeLiters: 1,
  },
  output: {
    eqPerLiter: 1,
  },
} satisfies ToolExample<
  EquivalentConcentrationInput,
  EquivalentConcentrationOutput
>;
