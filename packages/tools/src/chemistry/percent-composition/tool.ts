import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PercentCompositionInput = {
  readonly compoundMolarMassG: number;
  readonly elementMassContributedG: number;
};

export type PercentCompositionOutput = {
  readonly percentComposition: number;
};

export const percentCompositionExample = {
  input: { elementMassContributedG: 16, compoundMolarMassG: 80 },
  output: { percentComposition: 20 },
} satisfies ToolExample<PercentCompositionInput, PercentCompositionOutput>;

export const percentCompositionTool = createSimpleTool({
  id: "chemistry/percent-composition",
  title: "Percent Composition Calculator",
  description:
    "Compute the mass percentage an element contributes to a compound's molar mass.",
  inputs: [
    {
      description: "Mass contribution of the element per formula unit.",
      id: "elementMassContributedG",
      kind: "number",
      label: "Element mass contributed",
      unit: "g",
    },
    {
      description: "Total molar mass of the compound.",
      id: "compoundMolarMassG",
      kind: "number",
      label: "Compound molar mass",
      unit: "g/mol",
    },
  ],
  outputs: [
    {
      description: "Mass percentage of the element in the compound.",
      format: "percent",
      id: "percentComposition",
      kind: "number",
      label: "Percent composition",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const elementMassContributedG = input.elementMassContributedG as number;
    if (elementMassContributedG < 0)
      simpleError(
        "elementMassContributedG",
        "The element mass cannot be negative.",
        "invalid_masses",
      );
    const compoundMolarMassG = input.compoundMolarMassG as number;
    if (!(compoundMolarMassG > 0))
      simpleError(
        "compoundMolarMassG",
        "The compound molar mass must be greater than zero.",
        "invalid_masses",
      );
    if (elementMassContributedG > compoundMolarMassG)
      simpleError(
        "elementMassContributedG",
        "The element mass must not exceed the compound molar mass.",
        "invalid_masses",
      );
    return {
      percentComposition: (elementMassContributedG / compoundMolarMassG) * 100,
    };
  },
});
export const runPercentComposition = percentCompositionTool.execute;
export default percentCompositionTool;
