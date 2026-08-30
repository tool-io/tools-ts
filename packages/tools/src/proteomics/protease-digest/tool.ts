import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly cleaveAfter: string;
  readonly blockedNext: string;
}>;
export type Output = Readonly<{
  readonly digestedPeptides: readonly string[];
  readonly cleavagePositions: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    cuts: number[] = [];
  for (let i = 0; i < s.length - 1; i++)
    if (
      input.cleaveAfter.includes(s[i]) &&
      !input.blockedNext.includes(s[i + 1])
    )
      cuts.push(i + 1);
  let start = 0;
  const digestedPeptides = cuts.map((end) => {
    const p = s.slice(start, end);
    start = end;
    return p;
  });
  digestedPeptides.push(s.slice(start));
  return { digestedPeptides, cleavagePositions: cuts };
};
export const exampleInput = {
  sequence: "AKPAKR",
  cleaveAfter: "KR",
  blockedNext: "P",
} satisfies Input;
export const exampleOutput = {
  digestedPeptides: ["AKPAK", "R"],
  cleavagePositions: [5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protease-digest",
  title: "Protease Digest",
  description:
    "Simulate sequence digestion from caller-specified cut and blocking residues.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "cleaveAfter", label: "Cleave after", kind: "string" },
    { id: "blockedNext", label: "Blocked next", kind: "string" },
  ],
  outputs: [
    { id: "digestedPeptides", label: "Digested peptides", kind: "stringList" },
    {
      id: "cleavagePositions",
      label: "Cleavage positions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      cleaveAfter: value.cleaveAfter as string,
      blockedNext: value.blockedNext as string,
    }),
});
export const run = tool.execute;
export default tool;
