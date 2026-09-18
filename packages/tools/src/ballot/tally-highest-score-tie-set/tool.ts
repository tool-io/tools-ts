import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  candidates: readonly string[];
  scores: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "candidates", label: "candidates", kind: "stringList" },
  { id: "scores", label: "scores", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.candidates.length === i.scores.length &&
      H.unique(i.candidates).length === i.candidates.length,
  );
  return H.finish({
    maximum: i.scores.length ? Math.max(...i.scores) : null,
    candidates: i.candidates.filter(
      (_, j) => i.scores[j] === Math.max(...i.scores),
    ),
  });
};
export const example = {
  input: { candidates: ["a", "b", "c"], scores: [1, 2, 2] },
  output: { result: { maximum: 2, candidates: ["b", "c"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ballot/tally-highest-score-tie-set",
  title: "Ballot Tally Highest Score Tie Set",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Select every exact maximum supplied tally, preserving caller candidate order; empty evidence returns null maximum and no fabricated winner.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
