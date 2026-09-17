import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: number;
  recordBytes: number;
  headerBytes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "integer", label: "bytes" },
  { id: "recordBytes", kind: "integer", label: "recordBytes" },
  { id: "headerBytes", kind: "integer", label: "headerBytes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.bytes);
  H.int(i.recordBytes, 1);
  H.int(i.headerBytes, 0, i.bytes);
  const available = i.bytes - i.headerBytes;
  return H.finish({
    records: Math.floor(available / i.recordBytes),
    remainder: available % i.recordBytes,
  });
};
export const example = {
  input: { bytes: 20, recordBytes: 6, headerBytes: 3 },
  output: { result: { records: 2, remainder: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/buffer-equal-record-slot-count",
  title: "Buffer Equal Record Slot Count",
  description:
    "Budget fixed-byte records after an explicit buffer header reservation, retaining unused tail bytes.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
