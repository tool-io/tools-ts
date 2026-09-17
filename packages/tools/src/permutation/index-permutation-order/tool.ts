import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ permutation: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "permutation", kind: "numberList", label: "permutation" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const c = H.cycles(i.permutation);
  let order = 1n;
  for (const r of c) {
    const n = BigInt(r.length);
    order = (order / H.gcd(order, n)) * n;
  }
  return H.finish({ order: String(order) });
};
export const example = {
  input: { permutation: [1, 0, 3, 4, 2] },
  output: { result: { order: "6" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/index-permutation-order",
  title: "Index Permutation Order",
  description:
    "Return exact permutation order as the least common multiple of cycle lengths; the empty permutation has order one.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
