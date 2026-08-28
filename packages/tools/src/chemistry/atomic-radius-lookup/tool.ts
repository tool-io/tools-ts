import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
const TABLE: Record<string, number> = {
  H: 53,
  Li: 167,
  Be: 112,
  B: 87,
  C: 67,
  N: 56,
  O: 48,
  F: 42,
  Ne: 38,
  Na: 190,
  Mg: 145,
  Al: 118,
  Si: 111,
  P: 98,
  S: 88,
  Cl: 79,
  K: 243,
  Ca: 194,
  Fe: 156,
};
export const atomicRadiusLookupTool = createSimpleTool({
  id: "chemistry/atomic-radius-lookup",
  title: "Atomic Radius Lookup",
  description:
    "Look up a calculated atomic radius for an element in picometers.",
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
      description: "Calculated atomic radius in picometers.",
      id: "radiusPm",
      kind: "number",
      label: "Atomic radius",
      unit: "pm",
    },
  ],
  calculate: (input) => {
    const raw = String(input.element).trim().toLowerCase();
    const key = raw.length === 0 ? "" : raw[0].toUpperCase() + raw.slice(1);
    if (!(key in TABLE)) simpleError("element", "Not found.", "not_found");
    return { radiusPm: TABLE[key] };
  },
});
export const runAtomicRadiusLookup = atomicRadiusLookupTool.execute;
export default atomicRadiusLookupTool;

export type AtomicRadiusLookupInput = {
  readonly element: string;
};

export type AtomicRadiusLookupOutput = {
  readonly radiusPm: number;
};

export const atomicRadiusLookupExample = {
  input: { element: "C" },
  output: { radiusPm: 67 },
} satisfies ToolExample<AtomicRadiusLookupInput, AtomicRadiusLookupOutput>;
