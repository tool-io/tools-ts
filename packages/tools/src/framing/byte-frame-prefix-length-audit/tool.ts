import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  lengthBytes: number;
  littleEndian: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "lengthBytes", kind: "integer", label: "lengthBytes" },
  { id: "littleEndian", kind: "boolean", label: "littleEndian" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.int(i.lengthBytes, 1, 4);
  const declared = Number(
      H.wordValue(i.bytes, 0, i.lengthBytes, i.littleEndian),
    ),
    actual = i.bytes.length - i.lengthBytes;
  return H.finish({
    declared,
    actual,
    difference: actual - declared,
    matches: declared === actual,
  });
};
export const example = {
  input: { bytes: [3, 1, 2], lengthBytes: 1, littleEndian: false },
  output: {
    result: { declared: 3, actual: 2, difference: -1, matches: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/byte-frame-prefix-length-audit",
  title: "Byte Frame Prefix Length Audit",
  description:
    "Compare a leading unsigned byte length field against the complete remaining frame payload; mismatch is evidence, not a thrown truncation error.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
