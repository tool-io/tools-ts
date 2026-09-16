import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  data: readonly number[];
  permutation: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "data", kind: "numberList", label: "data" },
  { id: "permutation", kind: "numberList", label: "permutation" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.data);
  const data = i.data;
  H.permutation(i.permutation);
  H.check(data.length === i.permutation.length);
  return H.finish({ bytes: i.permutation.map((j) => data[j]) });
};
export const example = {
  input: { data: [10, 20, 30], permutation: [2, 0, 1] },
  output: { result: { bytes: [30, 10, 20] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/byte-lane-permutation",
  title: "Byte Lane Permutation Tool",
  description:
    "Reorder byte lanes with a complete output-to-input permutation; no endian or packing assumptions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
