import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  candidates: readonly string[];
  ballotsJson: string;
  positionScores: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "candidates", label: "candidates", kind: "stringList" },
  { id: "ballotsJson", label: "ballotsJson", kind: "string" },
  { id: "positionScores", label: "positionScores", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const b = H.ballots(i.ballotsJson, i.candidates);
  H.check(i.positionScores.length === i.candidates.length);
  return H.finish({
    tally: i.candidates.map((candidate) => ({
      candidate,
      score: b.reduce((s, v) => {
        const j = v.indexOf(candidate);
        return s + (j < 0 ? 0 : i.positionScores[j]);
      }, 0),
    })),
  });
};
export const example = {
  input: {
    candidates: ["a", "b", "c"],
    ballotsJson: '[["a","b"],["b","a"],[]]',
    positionScores: [2, 1, 0],
  },
  output: {
    result: {
      tally: [
        { candidate: "a", score: 3 },
        { candidate: "b", score: 3 },
        { candidate: "c", score: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ballot/rank-position-score-tally",
  title: "Rank Position Score Ballot Tally",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Apply explicit caller rank-position points to strict partial rankings; unranked candidates receive zero, no hidden Borda variant or tie ranks.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
