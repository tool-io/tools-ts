import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ tuples: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tuples", kind: "matrix", label: "tuples" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const j = i.tuples.findIndex(
    (v, j) => j > 0 && H.tupleCompare(i.tuples[j - 1], v) > 0,
  );
  return H.finish({ sorted: j < 0, violation: j < 0 ? null : [j - 1, j] });
};
export const example = {
  input: { tuples: [[1, 2], [1, 1], [2]] },
  output: { result: { sorted: false, violation: [0, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/lexicographic-tuple-order-check",
  title: "Lexicographic Tuple Order Check",
  description:
    "Check finite numeric tuples in lexicographic order, with shorter matching prefixes before longer tuples and explicit adjacent failure witnesses.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
