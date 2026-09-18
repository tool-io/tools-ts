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
  H.check(i.weights.length === b.length);
  H.nonnegative(i.weights);
  return H.finish({
    tally: i.candidates.map((candidate) => ({
      candidate,
      support: b.reduce(
        (s, v, j) => s + (v.includes(candidate) ? i.weights[j] : 0),
        0,
      ),
    })),
  });
};
export const example = {
  input: {
    candidates: ["a", "b", "c"],
    ballotsJson: '[["a","b"],["b","a"],[]]',
    weights: [2, 3, 1],
  },
  output: {
    result: {
      tally: [
        { candidate: "a", support: 5 },
        { candidate: "b", support: 5 },
        { candidate: "c", support: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ballot/approval-set-weight-tally",
  title: "Approval Set Ballot Weight Tally",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Tally unique-candidate approval sets with explicit nonnegative weights; repeated candidates reject instead of inflating support.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
