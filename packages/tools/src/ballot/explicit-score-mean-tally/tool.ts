import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  candidates: readonly string[];
  scores: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "candidates", label: "candidates", kind: "stringList" },
  { id: "scores", label: "scores", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    H.unique(i.candidates).length === i.candidates.length &&
      i.scores.every((row) => row.length === i.candidates.length),
  );
  return H.finish({
    tally: i.candidates.map((candidate, j) => ({
      candidate,
      score: i.scores.length
        ? i.scores.reduce((s, row) => s + row[j], 0) / i.scores.length
        : null,
    })),
  });
};
export const example = {
  input: {
    candidates: ["a", "b"],
    scores: [
      [1, 3],
      [2, 0],
    ],
  },
  output: {
    result: {
      tally: [
        { candidate: "a", score: 1.5 },
        { candidate: "b", score: 1.5 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ballot/explicit-score-mean-tally",
  title: "Explicit Score Ballot Mean Tally",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Aggregate mean of aligned complete explicit numeric score rows; signed scores allowed, absent rows yield null means.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
