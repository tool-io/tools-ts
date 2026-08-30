import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence, trypsinCutPositions } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly trypticPeptides: readonly string[];
  readonly cleavagePositions: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    cleavagePositions = trypsinCutPositions(s);
  let start = 0;
  const trypticPeptides = cleavagePositions.map((end) => {
    const peptide = s.slice(start, end);
    start = end;
    return peptide;
  });
  trypticPeptides.push(s.slice(start));
  return { trypticPeptides, cleavagePositions };
};
export const exampleInput = { sequence: "AKRA" } satisfies Input;
export const exampleOutput = {
  trypticPeptides: ["AK", "R", "A"],
  cleavagePositions: [2, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/tryptic-peptides",
  title: "Tryptic Peptides",
  description:
    "Generate fully tryptic peptides with K/R cleavage blocked before proline.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "trypticPeptides", label: "Tryptic peptides", kind: "stringList" },
    {
      id: "cleavagePositions",
      label: "Cleavage positions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
