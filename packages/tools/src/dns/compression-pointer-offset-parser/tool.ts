import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bytes: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.check(i.bytes.length === 2 && (i.bytes[0] & 192) === 192);
  return H.finish({ offset: (i.bytes[0] & 63) * 256 + i.bytes[1] });
};
export const example = {
  input: { bytes: [193, 44] },
  output: { result: { offset: 300 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/compression-pointer-offset-parser",
  title: "DNS Compression Pointer Offset Parser",
  description:
    "Parse exactly one two-byte DNS compression pointer into its 14-bit packet offset; does not dereference the pointer.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
