import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string; permutation: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", kind: "string", label: "bits" },
  { id: "permutation", kind: "numberList", label: "permutation" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bits(i.bits);
  const data = i.bits.split("");
  H.permutation(i.permutation);
  H.check(data.length === i.permutation.length);
  return H.finish({ bits: i.permutation.map((j) => data[j]).join("") });
};
export const example = {
  input: { bits: "100", permutation: [2, 0, 1] },
  output: { result: { bits: "010" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/bit-lane-permutation",
  title: "Bit Lane Permutation Tool",
  description:
    "Reorder bit lanes with a complete output-to-input permutation; no endian or packing assumptions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
