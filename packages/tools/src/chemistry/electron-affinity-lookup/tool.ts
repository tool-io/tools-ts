import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
const TABLE: Record<string, number> = {
  F: 328,
  Cl: 349,
  Br: 325,
  I: 295,
  O: 141,
  S: 200,
  N: -7,
  C: 122,
  H: 73,
  Li: 60,
  Na: 53,
  K: 48,
};
export const electronAffinityLookupTool = createSimpleTool({
  id: "chemistry/electron-affinity-lookup",
  title: "Electron Affinity Lookup",
  description: "Look up electron affinity for an element in kJ/mol.",
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
      description: "Electron affinity in kJ/mol.",
      id: "electronAffinityKJPerMol",
      kind: "number",
      label: "Electron affinity",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const symbol = String(input.element).trim();
    const key =
      symbol.slice(0, 1).toUpperCase() + symbol.slice(1).toLowerCase();
    if (!(key in TABLE)) simpleError("element", "Not found.", "not_found");
    return { electronAffinityKJPerMol: TABLE[key] };
  },
});
export const runElectronAffinityLookup = electronAffinityLookupTool.execute;
export default electronAffinityLookupTool;

export type ElectronAffinityLookupInput = {
  readonly element: string;
};

export type ElectronAffinityLookupOutput = {
  readonly electronAffinityKJPerMol: number;
};

export const electronAffinityLookupExample = {
  input: { element: "Cl" },
  output: { electronAffinityKJPerMol: 349 },
} satisfies ToolExample<
  ElectronAffinityLookupInput,
  ElectronAffinityLookupOutput
>;
