import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ values: readonly number[]; count: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "numberList" },
  { id: "count", label: "count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.count, 0, Math.floor((i.values.length - 1) / 2));
  H.check(i.values.length > 0);
  const sorted = [...i.values].sort((a, b) => a - b);
  return H.finish({
    values: i.values.map((x) =>
      Math.max(
        sorted[i.count],
        Math.min(sorted[sorted.length - i.count - 1], x),
      ),
    ),
  });
};
export const example = {
  input: { values: [9, 1, 5, 2, 6], count: 1 },
  output: { result: { values: [6, 2, 5, 2, 6] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/winsorize-fixed-count-per-tail",
  title: "Winsorize Fixed Count per Tail",
  description:
    "Apply fixed-count-per-tail winsorization retaining original observation order with a nonempty retained center; exact equal values use stable numeric order.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
