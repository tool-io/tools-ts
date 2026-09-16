import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bytes: readonly number[]; recordSize: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "recordSize", kind: "integer", label: "recordSize" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.int(i.recordSize, 1, 128);
  const complete = Math.floor(i.bytes.length / i.recordSize);
  return H.finish({
    records: Array.from({ length: complete }, (_, j) =>
      i.bytes.slice(j * i.recordSize, (j + 1) * i.recordSize),
    ),
    tail: i.bytes.slice(complete * i.recordSize),
  });
};
export const example = {
  input: { bytes: [1, 2, 3, 4, 5], recordSize: 2 },
  output: {
    result: {
      records: [
        [1, 2],
        [3, 4],
      ],
      tail: [5],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/byte-array-fixed-record-split",
  title: "Byte Array Fixed Record Splitter",
  description:
    "Split dense byte arrays into complete fixed-width records, preserving an incomplete tail instead of discarding it.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
