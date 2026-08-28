import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const lewisStructureNotationTool = createSimpleTool({
  id: "chemistry/lewis-structure-notation",
  title: "Lewis Structure Notation Generator",
  description:
    "Format a Lewis structure notation string from element symbol and valence electron count.",
  inputs: [
    {
      description: "Element symbol.",
      id: "element",
      kind: "string",
      label: "Element",
    },
    {
      description: "Number of valence electrons to show as dots.",
      id: "valenceElectrons",
      kind: "integer",
      label: "Valence electrons",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Lewis dot notation string.",
      id: "notation",
      kind: "string",
      label: "Lewis notation",
    },
  ],
  calculate: (input) => {
    return {
      notation:
        "[" +
        String(input.element).toUpperCase() +
        ".".repeat(input.valenceElectrons as number) +
        "]",
    };
  },
});
export const runLewisStructureNotation = lewisStructureNotationTool.execute;
export default lewisStructureNotationTool;

export type LewisStructureNotationInput = {
  readonly element: string;
  readonly valenceElectrons: number;
};

export type LewisStructureNotationOutput = {
  readonly notation: string;
};

export const lewisStructureNotationExample = {
  input: {
    element: "C",
    valenceElectrons: 4,
  },
  output: {
    notation: "[C....]",
  },
} satisfies ToolExample<
  LewisStructureNotationInput,
  LewisStructureNotationOutput
>;
