import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly h: number;
  readonly k: number;
}>;
export type Output = Readonly<{
  readonly triangulationNumber: number;
  readonly capsomereCount: number;
  readonly proteinSubunits: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.h, "h");
  count(input.k, "k");
  const triangulationNumber = input.h ** 2 + input.h * input.k + input.k ** 2;
  count(triangulationNumber, "h", 1);
  const capsomereCount = 10 * triangulationNumber + 2,
    proteinSubunits = 60 * triangulationNumber;
  count(capsomereCount, "h");
  count(proteinSubunits, "h");
  return { triangulationNumber, capsomereCount, proteinSubunits };
};
export const exampleInput = { h: 1, k: 1 } satisfies Input;
export const exampleOutput = {
  triangulationNumber: 3,
  capsomereCount: 32,
  proteinSubunits: 180,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/icosahedral-lattice-counts",
  title: "Icosahedral Lattice Counts",
  description:
    "Calculate the Caspar–Klug triangulation number, capsomere count, and protein-subunit count for a conventional icosahedral lattice.",
  inputs: [
    { id: "h", label: "H", kind: "integer", minimum: 0 },
    { id: "k", label: "K", kind: "integer", minimum: 0 },
  ],
  outputs: [
    {
      id: "triangulationNumber",
      label: "Triangulation number",
      kind: "number",
    },
    { id: "capsomereCount", label: "Capsomere count", kind: "number" },
    { id: "proteinSubunits", label: "Protein subunits", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      h: value.h as number,
      k: value.k as number,
    }),
});
export const run = tool.execute;
export default tool;
