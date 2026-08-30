import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sequenceLength: number;
  readonly peptideStarts: readonly number[];
  readonly peptideEnds: readonly number[];
}>;
export type Output = Readonly<{
  readonly coveredResidues: number;
  readonly coveragePercent: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.peptideStarts.length;
  if (
    !Number.isSafeInteger(input.sequenceLength) ||
    input.sequenceLength <= 0 ||
    n === 0 ||
    n !== input.peptideEnds.length ||
    input.peptideStarts.some(
      (v, i) =>
        !Number.isSafeInteger(v) ||
        !Number.isSafeInteger(input.peptideEnds[i]) ||
        v < 0 ||
        v >= input.peptideEnds[i] ||
        input.peptideEnds[i] > input.sequenceLength,
    )
  )
    simpleError(
      "peptideStarts",
      "Valid aligned half-open peptide intervals required.",
    );
  const covered = new Set<number>();
  input.peptideStarts.forEach((v, i) => {
    for (let j = v; j < input.peptideEnds[i]; j++) covered.add(j);
  });
  return {
    coveredResidues: covered.size,
    coveragePercent: (covered.size / input.sequenceLength) * 100,
  };
};
export const exampleInput = {
  sequenceLength: 10,
  peptideStarts: [0, 3, 8],
  peptideEnds: [5, 7, 10],
} satisfies Input;
export const exampleOutput = {
  coveredResidues: 9,
  coveragePercent: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-sequence-coverage",
  title: "Protein Sequence Coverage",
  description:
    "Measure protein sequence coverage as the union of peptide intervals.",
  inputs: [
    { id: "sequenceLength", label: "Sequence length", kind: "number" },
    { id: "peptideStarts", label: "Peptide starts", kind: "numberList" },
    { id: "peptideEnds", label: "Peptide ends", kind: "numberList" },
  ],
  outputs: [
    { id: "coveredResidues", label: "Covered residues", kind: "number" },
    { id: "coveragePercent", label: "Coverage percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequenceLength: value.sequenceLength as number,
      peptideStarts: value.peptideStarts as readonly number[],
      peptideEnds: value.peptideEnds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
