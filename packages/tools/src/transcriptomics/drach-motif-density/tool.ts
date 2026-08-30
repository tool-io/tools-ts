import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rnaSequence: string;
  readonly minimumMotifsPerKb: number;
}>;
export type Output = Readonly<{
  readonly motifStarts: readonly number[];
  readonly motifsPerKb: number;
  readonly passes: boolean;
}>;

export const calculate = (input: Input): Output => {
  const s = input.rnaSequence.toUpperCase().replace(/T/g, "U");
  if (!/^[ACGU]+$/.test(s))
    simpleError("rnaSequence", "Nonempty RNA sequence required.");
  const motifStarts: number[] = [];
  for (let i = 0; i <= s.length - 5; i++)
    if (/^[AGU][AG]AC[ACU]$/.test(s.slice(i, i + 5))) motifStarts.push(i);
  const motifsPerKb = (motifStarts.length / s.length) * 1000;
  return {
    motifStarts,
    motifsPerKb,
    passes: motifsPerKb >= input.minimumMotifsPerKb,
  };
};

export const exampleInput = {
  rnaSequence: "GGACUAAAGGACU",
  minimumMotifsPerKb: 100,
} satisfies Input;
export const exampleOutput = {
  motifStarts: [0, 8],
  motifsPerKb: 153.84615384615387,
  passes: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/drach-motif-density",
  title: "DRACH Motif Density",
  description: "Scan DRACH motifs and report sites per kilobase of RNA.",
  inputs: [
    { id: "rnaSequence", kind: "string", label: "RNA sequence" },
    {
      id: "minimumMotifsPerKb",
      kind: "number",
      label: "Minimum motifs per kb",
    },
  ],
  outputs: [
    { id: "motifStarts", kind: "numberList", label: "Motif starts" },
    { id: "motifsPerKb", kind: "number", label: "Motifs per kb" },
    { id: "passes", kind: "boolean", label: "Passes" },
  ],
  calculate: (value) =>
    calculate({
      rnaSequence: value.rnaSequence as string,
      minimumMotifsPerKb: value.minimumMotifsPerKb as number,
    }),
});
export const run = tool.execute;
export default tool;
