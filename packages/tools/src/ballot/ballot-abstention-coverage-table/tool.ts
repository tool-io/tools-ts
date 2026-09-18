import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  candidates: readonly string[];
  ballotsJson: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "candidates", label: "candidates", kind: "stringList" },
  { id: "ballotsJson", label: "ballotsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const b = H.ballots(i.ballotsJson, i.candidates);
  return H.finish({
    ballots: b.length,
    abstentions: b.filter((v) => v.length === 0).length,
    candidates: i.candidates.map((candidate) => ({
      candidate,
      observed: b.filter((v) => v.includes(candidate)).length,
      notObserved: b.filter((v) => !v.includes(candidate)).length,
    })),
  });
};
export const example = {
  input: {
    candidates: ["a", "b", "c"],
    ballotsJson: '[["a","b"],["b","a"],[]]',
  },
  output: {
    result: {
      ballots: 3,
      abstentions: 1,
      candidates: [
        { candidate: "a", observed: 2, notObserved: 1 },
        { candidate: "b", observed: 2, notObserved: 1 },
        { candidate: "c", observed: 0, notObserved: 3 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ballot/ballot-abstention-coverage-table",
  title: "Ballot Abstention Coverage Table",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Report whole-ballot abstentions separately from candidate non-observation in partial rankings/approval sets; missing does not imply opposition.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
