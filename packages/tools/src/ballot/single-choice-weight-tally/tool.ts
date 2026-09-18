import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  candidates: readonly string[];
  ballotsJson: string;
  weights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "candidates", label: "candidates", kind: "stringList" },
  { id: "ballotsJson", label: "ballotsJson", kind: "string" },
  { id: "weights", label: "weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const b = H.ballots(i.ballotsJson, i.candidates);
  H.check(b.every((v) => v.length <= 1));
  H.check(i.weights.length === b.length);
  H.nonnegative(i.weights);
  return H.finish({
    tally: i.candidates.map((candidate) => ({
      candidate,
      support: b.reduce(
        (s, v, j) => s + (v[0] === candidate ? i.weights[j] : 0),
        0,
      ),
    })),
    abstentions: b.filter((v) => v.length === 0).length,
  });
};
export const example = {
  input: {
    candidates: ["a", "b"],
    ballotsJson: '[["a"],["b"],[]]',
    weights: [2, 3, 1],
  },
  output: {
    result: {
      tally: [
        { candidate: "a", support: 2 },
        { candidate: "b", support: 3 },
      ],
      abstentions: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ballot/single-choice-weight-tally",
  title: "Single Choice Ballot Weight Tally",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Tally nonnegative supplied weight of single-choice ballots; empty ballots are abstentions, more than one choice rejects.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
