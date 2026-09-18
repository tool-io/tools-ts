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
  H.check(H.unique(i.candidates).length === i.candidates.length);
  const b = H.arr(i.ballotsJson).map((v) => {
    H.check(Array.isArray(v));
    return (v as unknown[]).map(H.str);
  });
  return H.finish({
    unknown: b.flatMap((v, index) =>
      v.flatMap((candidate, position) =>
        i.candidates.includes(candidate)
          ? []
          : [{ index, position, candidate }],
      ),
    ),
    unused: i.candidates.filter((x) => !b.some((v) => v.includes(x))),
  });
};
export const example = {
  input: {
    candidates: ["a", "b", "c"],
    ballotsJson: '[["a","b"],["b","a"],[]]',
  },
  output: { result: { unknown: [], unused: ["c"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ballot/candidate-occurrence-coverage-audit",
  title: "Ballot Candidate Occurrence Coverage Audit",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Audit unknown ballot candidate occurrences separately from candidates never observed, retaining all occurrence positions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
