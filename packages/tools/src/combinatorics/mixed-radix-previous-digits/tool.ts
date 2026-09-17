import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  digits: readonly number[];
  radices: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "digits", kind: "numberList", label: "digits" },
  { id: "radices", kind: "numberList", label: "radices" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const index = H.radixEncode(i.digits, i.radices) - 1n;
  return H.finish({
    digits:
      index >= 0n && index < H.radix(i.radices)
        ? H.radixDecode(index, i.radices)
        : null,
  });
};
export const example = {
  input: { digits: [0, 2], radices: [2, 3] },
  output: { result: { digits: [0, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/mixed-radix-previous-digits",
  title: "Mixed Radix Previous Digits",
  description:
    "Advance a mixed-radix tuple backward by one in most-significant-first lexicographic order, returning null rather than wrapping at boundaries.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
