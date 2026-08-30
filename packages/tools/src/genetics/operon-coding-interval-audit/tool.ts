import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly orfStarts: readonly number[];
  readonly orfEnds: readonly number[];
  readonly transcriptEnd: number;
}>;
export type Output = Readonly<{
  readonly orfCount: number;
  readonly polycistronic: boolean;
  readonly codingBases: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.orfStarts, input.orfEnds, "orfStarts");
  count(input.transcriptEnd, "transcriptEnd", 1);
  if (
    input.orfStarts.some(
      (v, i) =>
        !Number.isSafeInteger(v) ||
        v < 0 ||
        !Number.isSafeInteger(input.orfEnds[i]) ||
        input.orfEnds[i] <= v ||
        input.orfEnds[i] > input.transcriptEnd ||
        (i > 0 && v < input.orfEnds[i - 1]),
    )
  )
    simpleError(
      "orfStarts",
      "Ordered nonoverlapping coding intervals within a transcript required.",
    );
  return {
    orfCount: input.orfStarts.length,
    polycistronic: input.orfStarts.length > 1,
    codingBases: input.orfStarts.reduce(
      (sum, v, i) => sum + input.orfEnds[i] - v,
      0,
    ),
  };
};
export const exampleInput = {
  orfStarts: [0, 10, 20],
  orfEnds: [6, 16, 26],
  transcriptEnd: 30,
} satisfies Input;
export const exampleOutput = {
  orfCount: 3,
  polycistronic: true,
  codingBases: 18,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/operon-coding-interval-audit",
  title: "Operon Coding Interval Audit",
  description:
    "Audit coding intervals in one bacterial transcript and count its cistrons.",
  inputs: [
    { id: "orfStarts", label: "Orf starts", kind: "numberList" },
    { id: "orfEnds", label: "Orf ends", kind: "numberList" },
    { id: "transcriptEnd", label: "Transcript end", kind: "integer" },
  ],
  outputs: [
    { id: "orfCount", label: "Orf count", kind: "number" },
    { id: "polycistronic", label: "Polycistronic", kind: "boolean" },
    { id: "codingBases", label: "Coding bases", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      orfStarts: value.orfStarts as readonly number[],
      orfEnds: value.orfEnds as readonly number[],
      transcriptEnd: value.transcriptEnd as number,
    }),
});
export const run = tool.execute;
export default tool;
