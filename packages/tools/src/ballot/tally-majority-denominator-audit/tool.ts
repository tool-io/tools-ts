import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  support: number;
  cast: number;
  eligible: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "support", label: "support", kind: "number" },
  { id: "cast", label: "cast", kind: "number" },
  { id: "eligible", label: "eligible", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.support >= 0 && i.cast >= i.support && i.eligible >= i.cast);
  return H.finish({
    castMajority: i.cast > 0 ? i.support > i.cast / 2 : null,
    eligibleMajority: i.eligible > 0 ? i.support > i.eligible / 2 : null,
    castShare: i.cast ? i.support / i.cast : null,
    eligibleShare: i.eligible ? i.support / i.eligible : null,
  });
};
export const example = {
  input: { support: 6, cast: 10, eligible: 20 },
  output: {
    result: {
      castMajority: true,
      eligibleMajority: false,
      castShare: 0.6,
      eligibleShare: 0.3,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ballot/tally-majority-denominator-audit",
  title: "Ballot Tally Majority Denominator Audit",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Compare supplied support against explicit cast versus eligible denominators, with strict-majority and null zero-denominator evidence; quantities must use the same units.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
