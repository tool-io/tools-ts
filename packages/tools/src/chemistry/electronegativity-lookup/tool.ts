import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
const TABLE: Record<string, number> = {
  H: 2.2,
  Li: 0.98,
  Be: 1.57,
  B: 2.04,
  C: 2.55,
  N: 3.04,
  O: 3.44,
  F: 3.98,
  Na: 0.93,
  Mg: 1.31,
  Al: 1.61,
  Si: 1.9,
  P: 2.19,
  S: 2.58,
  Cl: 3.16,
  K: 0.82,
  Ca: 1,
};
export const electronegativityLookupTool = createSimpleTool({
  id: "chemistry/electronegativity-lookup",
  title: "Electronegativity Lookup",
  description: "Look up Pauling electronegativity value for an element symbol.",
  inputs: [
    {
      description: "Element symbol.",
      id: "element",
      kind: "string",
      label: "Element",
    },
  ],
  outputs: [
    {
      description: "Pauling electronegativity.",
      id: "value",
      kind: "number",
      label: "Electronegativity",
    },
  ],
  calculate: (input) => {
    const symbol = String(input.element).trim();
    const key =
      symbol.slice(0, 1).toUpperCase() + symbol.slice(1).toLowerCase();
    if (!(key in TABLE)) simpleError("element", "Not found.", "not_found");
    return { value: TABLE[key] };
  },
});
export const runElectronegativityLookup = electronegativityLookupTool.execute;
export default electronegativityLookupTool;

export type ElectronegativityLookupInput = {
  readonly element: string;
};

export type ElectronegativityLookupOutput = {
  readonly value: number;
};

export const electronegativityLookupExample = {
  input: { element: "O" },
  output: { value: 3.44 },
} satisfies ToolExample<
  ElectronegativityLookupInput,
  ElectronegativityLookupOutput
>;
