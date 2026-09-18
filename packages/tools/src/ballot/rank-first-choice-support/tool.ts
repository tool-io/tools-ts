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
    tally: i.candidates.map((candidate) => ({
      candidate,
      support: b.filter((v) => v.at(0) === candidate).length,
    })),
    abstentions: b.filter((v) => v.length === 0).length,
  });
};
export const example = {
  input: {
    candidates: ["a", "b", "c"],
    ballotsJson: '[["a","b"],["b","a"],[]]',
  },
  output: {
    result: {
      tally: [
        { candidate: "a", support: 1 },
        { candidate: "b", support: 1 },
        { candidate: "c", support: 0 },
      ],
      abstentions: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ballot/rank-first-choice-support",
  title: "Ranked Ballot First Choice Support",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Count first listed strict-ranking choices; partial rankings are literal and absent candidates are not assumed bottom-ranked.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
