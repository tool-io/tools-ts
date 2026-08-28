import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
const TABLE: Record<string, number> = {
  H: 1312,
  Li: 520,
  B: 801,
  C: 1086,
  N: 1402,
  O: 1314,
  F: 1681,
  Na: 496,
  Mg: 738,
  K: 419,
  Ca: 590,
  Fe: 763,
};
export const ionizationEnergyLookupTool = createSimpleTool({
  id: "chemistry/ionization-energy-lookup",
  title: "Ionization Energy Lookup",
  description: "Look up first ionization energy for an element in kJ/mol.",
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
      description: "First ionization energy in kJ/mol.",
      id: "ionizationEnergyKJPerMol",
      kind: "number",
      label: "Ionization energy",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const symbol = String(input.element).trim();
    const key =
      symbol.slice(0, 1).toUpperCase() + symbol.slice(1).toLowerCase();
    if (!(key in TABLE)) simpleError("element", "Not found.", "not_found");
    return { ionizationEnergyKJPerMol: TABLE[key] };
  },
});
export const runIonizationEnergyLookup = ionizationEnergyLookupTool.execute;
export default ionizationEnergyLookupTool;

export type IonizationEnergyLookupInput = {
  readonly element: string;
};

export type IonizationEnergyLookupOutput = {
  readonly ionizationEnergyKJPerMol: number;
};

export const ionizationEnergyLookupExample = {
  input: { element: "H" },
  output: { ionizationEnergyKJPerMol: 1312 },
} satisfies ToolExample<
  IonizationEnergyLookupInput,
  IonizationEnergyLookupOutput
>;
