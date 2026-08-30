import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  proteinSequence,
  kyteDoolittleHydropathy,
} from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly gravy: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  return {
    gravy:
      [...s].reduce((sum, v) => sum + kyteDoolittleHydropathy[v], 0) / s.length,
  };
};
export const exampleInput = { sequence: "AI" } satisfies Input;
export const exampleOutput = { gravy: 3.15 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-gravy",
  title: "Protein GRAVY",
  description: "Compute grand average of Kyte–Doolittle hydropathy.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [{ id: "gravy", label: "Gravy", kind: "number" }],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
