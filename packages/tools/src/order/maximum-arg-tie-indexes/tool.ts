import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ values: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", kind: "numberList", label: "values" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const value = i.values.length ? Math.max(...i.values) : null;
  return H.finish({
    value,
    indexes: i.values.flatMap((x, j) => (x === value ? [j] : [])),
  });
};
export const example = {
  input: { values: [30, 10, 10, 20] },
  output: { result: { value: 30, indexes: [0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/maximum-arg-tie-indexes",
  title: "Maximum Arg Tie Indexes",
  description:
    "Return all original indexes tied at the numeric maximum; empty inputs yield null value and no witnesses.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
