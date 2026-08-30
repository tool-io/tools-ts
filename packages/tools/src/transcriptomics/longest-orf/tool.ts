import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rnaSequence: string;
}>;
export type Output = Readonly<{
  readonly startIndex: number;
  readonly codingBases: number;
  readonly proteinLength: number;
}>;

export const calculate = (input: Input): Output => {
  const s = input.rnaSequence.toUpperCase().replace(/U/g, "T");
  if (!/^[ACGT]+$/.test(s))
    simpleError("rnaSequence", "A nucleotide sequence is required.");
  let bestStart = -1,
    bestEnd = -1;
  for (let i = 0; i <= s.length - 3; i++)
    if (s.slice(i, i + 3) === "ATG")
      for (let j = i + 3; j <= s.length - 3; j += 3)
        if (["TAA", "TAG", "TGA"].includes(s.slice(j, j + 3))) {
          if (j - i > bestEnd - bestStart) {
            bestStart = i;
            bestEnd = j;
          }
          break;
        }
  if (bestStart < 0)
    simpleError("rnaSequence", "No in-frame complete ORF found.");
  return {
    startIndex: bestStart,
    codingBases: bestEnd - bestStart,
    proteinLength: (bestEnd - bestStart) / 3,
  };
};

export const exampleInput = {
  rnaSequence: "CCCATGAAATAAGGGATGTAA",
} satisfies Input;
export const exampleOutput = {
  startIndex: 3,
  codingBases: 6,
  proteinLength: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/longest-orf",
  title: "Longest ORF",
  description:
    "Find the longest complete start-to-stop ORF and its protein length.",
  inputs: [{ id: "rnaSequence", kind: "string", label: "RNA sequence" }],
  outputs: [
    { id: "startIndex", kind: "number", label: "Start index" },
    { id: "codingBases", kind: "number", label: "Coding bases" },
    { id: "proteinLength", kind: "number", label: "Protein length" },
  ],
  calculate: (value) =>
    calculate({
      rnaSequence: value.rnaSequence as string,
    }),
});
export const run = tool.execute;
export default tool;
