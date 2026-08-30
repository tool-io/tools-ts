import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence, residueElements } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly carbon: number;
  readonly hydrogen: number;
  readonly nitrogen: number;
  readonly oxygen: number;
  readonly sulfur: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    sum = [0, 2, 0, 1, 0];
  for (const residue of s) {
    const atoms = residueElements[residue];
    for (let i = 0; i < sum.length; i++) sum[i] += atoms[i];
  }
  return {
    carbon: sum[0],
    hydrogen: sum[1],
    nitrogen: sum[2],
    oxygen: sum[3],
    sulfur: sum[4],
  };
};
export const exampleInput = { sequence: "A" } satisfies Input;
export const exampleOutput = {
  carbon: 3,
  hydrogen: 7,
  nitrogen: 1,
  oxygen: 2,
  sulfur: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-elemental-formula",
  title: "Protein Elemental Formula",
  description:
    "Sum C/H/N/O/S protein elemental formula from residue compositions and termini.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "carbon", label: "Carbon", kind: "number" },
    { id: "hydrogen", label: "Hydrogen", kind: "number" },
    { id: "nitrogen", label: "Nitrogen", kind: "number" },
    { id: "oxygen", label: "Oxygen", kind: "number" },
    { id: "sulfur", label: "Sulfur", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
