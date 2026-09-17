import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  start: number;
  width: number;
  checksum: string;
  littleEndian: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "start", kind: "integer", label: "start" },
  { id: "width", kind: "integer", label: "width" },
  { id: "checksum", kind: "string", label: "checksum" },
  { id: "littleEndian", kind: "boolean", label: "littleEndian" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.int(i.width, 1, 16);
  H.int(i.start, 0, i.bytes.length - i.width);
  const c = H.wordBytes(H.bigint(i.checksum), i.width, i.littleEndian);
  return H.finish({
    bytes: i.bytes.map((x, j) =>
      j >= i.start && j < i.start + i.width ? c[j - i.start] : x,
    ),
  });
};
export const example = {
  input: {
    bytes: [0, 0, 9],
    start: 0,
    width: 2,
    checksum: "258",
    littleEndian: false,
  },
  output: { result: { bytes: [1, 2, 9] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/checksum-field-insertion",
  title: "Checksum Field Insertion Tool",
  description:
    "Insert an explicit unsigned exact checksum integer into a bounded byte field with caller-selected byte order; does not recompute checksum coverage.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
