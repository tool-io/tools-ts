import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ valuesJson: string; budgetJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "valuesJson", kind: "string", label: "valuesJson" },
  { id: "budgetJson", kind: "string", label: "budgetJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const values = H.arr(i.valuesJson),
    budget = H.multiset(i.budgetJson);
  H.check(
    values.every(
      (v) => v === null || ["string", "number", "boolean"].includes(typeof v),
    ),
  );
  const admitted: number[] = [],
    rejected: number[] = [];
  values.forEach((v, j) => {
    const r = budget.get(JSON.stringify(v));
    if (r && r.count > 0) {
      admitted.push(j);
      r.count--;
    } else rejected.push(j);
  });
  return H.finish({
    admitted,
    rejected,
    remaining: H.msRows(budget).filter((v) => v.count > 0),
  });
};
export const example = {
  input: {
    valuesJson: '["a","b","a"]',
    budgetJson: '[{"value":"a","count":1}]',
  },
  output: { result: { admitted: [0], rejected: [1, 2], remaining: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "multiset/multiplicity-stable-occurrence-allocation",
  title: "Multiset Stable Occurrence Allocation",
  description:
    "Allocate typed occurrences stably against explicit per-key count budgets; earliest matching occurrences consume slots and all rejections remain indexed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
