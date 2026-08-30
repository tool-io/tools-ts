import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly transcriptLengthBp: number;
  readonly exonStartsBp: readonly number[];
  readonly exonEndsBp: readonly number[];
  readonly fragmentLengthBp: number;
}>;
export type Output = Readonly<{
  readonly exonUnionLengthBp: number;
  readonly effectiveLengthBp: number;
  readonly overlapBasesBp: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.exonStartsBp.length;
  if (
    n === 0 ||
    n !== input.exonEndsBp.length ||
    input.fragmentLengthBp < 1 ||
    input.exonStartsBp.some(
      (v, i) =>
        v < 0 ||
        v >= input.exonEndsBp[i] ||
        input.exonEndsBp[i] > input.transcriptLengthBp ||
        (i > 0 && v < input.exonStartsBp[i - 1]),
    )
  )
    simpleError(
      "exonStartsBp",
      "Sorted, valid exon intervals and positive fragment length required.",
    );
  let exonUnionLengthBp = 0,
    end = 0,
    rawBases = 0;
  for (let i = 0; i < n; i++) {
    const start = input.exonStartsBp[i],
      stop = input.exonEndsBp[i];
    rawBases += stop - start;
    exonUnionLengthBp += Math.max(0, stop - Math.max(start, end));
    end = Math.max(end, stop);
  }
  const effectiveLengthBp = Math.max(
    0,
    exonUnionLengthBp - input.fragmentLengthBp + 1,
  );
  return {
    exonUnionLengthBp,
    effectiveLengthBp,
    overlapBasesBp: rawBases - exonUnionLengthBp,
  };
};

export const exampleInput = {
  transcriptLengthBp: 500,
  exonStartsBp: [0, 200, 300],
  exonEndsBp: [100, 350, 400],
  fragmentLengthBp: 50,
} satisfies Input;
export const exampleOutput = {
  exonUnionLengthBp: 300,
  effectiveLengthBp: 251,
  overlapBasesBp: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/effective-transcript-length",
  title: "Effective Transcript Length",
  description:
    "Union overlapping exon intervals and subtract fragment length to estimate transcript effective length.",
  inputs: [
    {
      id: "transcriptLengthBp",
      kind: "integer",
      label: "Transcript length bp",
    },
    { id: "exonStartsBp", kind: "numberList", label: "Exon starts bp" },
    { id: "exonEndsBp", kind: "numberList", label: "Exon ends bp" },
    { id: "fragmentLengthBp", kind: "integer", label: "Fragment length bp" },
  ],
  outputs: [
    { id: "exonUnionLengthBp", kind: "integer", label: "Exon union length bp" },
    { id: "effectiveLengthBp", kind: "integer", label: "Effective length bp" },
    { id: "overlapBasesBp", kind: "integer", label: "Overlap bases bp" },
  ],
  calculate: (value) =>
    calculate({
      transcriptLengthBp: value.transcriptLengthBp as number,
      exonStartsBp: value.exonStartsBp as readonly number[],
      exonEndsBp: value.exonEndsBp as readonly number[],
      fragmentLengthBp: value.fragmentLengthBp as number,
    }),
});
export const run = tool.execute;
export default tool;
