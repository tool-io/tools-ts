import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly carbon: number;
  readonly hydrogen: number;
  readonly nitrogen: number;
  readonly oxygen: number;
  readonly sulfur: number;
  readonly phosphorus: number;
}>;
export type Output = Readonly<{
  readonly monoisotopicMassDa: number;
  readonly atomCount: number;
}>;
export const calculate = (input: Input): Output => {
  const atoms = [
    input.carbon,
    input.hydrogen,
    input.nitrogen,
    input.oxygen,
    input.sulfur,
    input.phosphorus,
  ];
  if (
    atoms.some((v) => !Number.isSafeInteger(v) || v < 0) ||
    atoms.every((v) => v === 0)
  )
    simpleError(
      "carbon",
      "Nonempty nonnegative integer formula counts required.",
    );
  const masses = [
    12, 1.00782503223, 14.00307400443, 15.99491461957, 31.9720711744,
    30.97376199842,
  ];
  return {
    monoisotopicMassDa: atoms.reduce((s, v, i) => s + v * masses[i], 0),
    atomCount: atoms.reduce((a, b) => a + b, 0),
  };
};
export const exampleInput = {
  carbon: 1,
  hydrogen: 0,
  nitrogen: 0,
  oxygen: 0,
  sulfur: 0,
  phosphorus: 0,
} satisfies Input;
export const exampleOutput = {
  monoisotopicMassDa: 12,
  atomCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/monoisotopic-formula-mass",
  title: "Monoisotopic Formula Mass",
  description:
    "Sum neutral monoisotopic mass from C/H/N/O/S/P atomic compositions.",
  inputs: [
    { id: "carbon", kind: "number", label: "Carbon" },
    { id: "hydrogen", kind: "number", label: "Hydrogen" },
    { id: "nitrogen", kind: "number", label: "Nitrogen" },
    { id: "oxygen", kind: "number", label: "Oxygen" },
    { id: "sulfur", kind: "number", label: "Sulfur" },
    { id: "phosphorus", kind: "number", label: "Phosphorus" },
  ],
  outputs: [
    { id: "monoisotopicMassDa", kind: "number", label: "Monoisotopic mass da" },
    { id: "atomCount", kind: "number", label: "Atom count" },
  ],
  calculate: (value) =>
    calculate({
      carbon: value.carbon as number,
      hydrogen: value.hydrogen as number,
      nitrogen: value.nitrogen as number,
      oxygen: value.oxygen as number,
      sulfur: value.sulfur as number,
      phosphorus: value.phosphorus as number,
    }),
});
export const run = tool.execute;
export default tool;
