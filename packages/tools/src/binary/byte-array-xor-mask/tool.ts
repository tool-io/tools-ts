import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  mask: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "mask", kind: "numberList", label: "mask" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.bytes(i.mask);
  H.check(i.mask.length > 0);
  return H.finish({
    bytes: i.bytes.map((v, j) => v ^ i.mask[j % i.mask.length]),
  });
};
export const example = {
  input: { bytes: [1, 2, 3], mask: [255, 0] },
  output: { result: { bytes: [254, 2, 252] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/byte-array-xor-mask",
  title: "Byte Array XOR Mask Tool",
  description:
    "XOR bytes with a nonempty repeating byte mask; this reversible transform is not encryption.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
