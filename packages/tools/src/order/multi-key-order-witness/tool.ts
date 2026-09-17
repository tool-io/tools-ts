import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  left: readonly number[];
  right: readonly number[];
  directions: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "numberList", label: "left" },
  { id: "right", kind: "numberList", label: "right" },
  { id: "directions", kind: "numberList", label: "directions" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.left.length === i.right.length &&
      i.left.length === i.directions.length &&
      i.directions.every((x) => x === 1 || x === -1),
  );
  const key = i.left.findIndex((x, j) => x !== i.right[j]);
  return H.finish({
    decisiveKey: key < 0 ? null : key,
    order:
      key < 0 ? 0 : Math.sign(i.left[key] - i.right[key]) * i.directions[key],
  });
};
export const example = {
  input: { left: [1, 3], right: [1, 2], directions: [1, -1] },
  output: { result: { decisiveKey: 1, order: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/multi-key-order-witness",
  title: "Multi Key Order Witness",
  description:
    "Compare two numeric multi-key tuples with per-key ascending/descending directions, exposing the first decisive key rather than coercing ties.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
