import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bytes: readonly number[]; spansJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "spansJson", kind: "string", label: "spansJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  const r = H.spans(i.spansJson);
  r.forEach(([a, b]) => {
    H.int(a, 0, i.bytes.length);
    H.int(b, a, i.bytes.length);
  });
  return H.finish({
    fields: r.map(([a, b]) => ({
      start: a,
      end: b,
      bytes: i.bytes.slice(a, b),
    })),
  });
};
export const example = {
  input: { bytes: [10, 20, 30], spansJson: "[[1,3]]" },
  output: { result: { fields: [{ start: 1, end: 3, bytes: [20, 30] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/byte-array-field-slice-table",
  title: "Byte Array Field Slice Table",
  description:
    "Slice explicitly bounded half-open byte field spans; overlaps remain allowed and observable.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
