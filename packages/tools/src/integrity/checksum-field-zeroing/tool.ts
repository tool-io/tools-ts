import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  start: number;
  width: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "start", kind: "integer", label: "start" },
  { id: "width", kind: "integer", label: "width" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.int(i.width, 1, 16);
  H.int(i.start, 0, i.bytes.length - i.width);
  return H.finish({
    bytes: i.bytes.map((x, j) =>
      j >= i.start && j < i.start + i.width ? 0 : x,
    ),
  });
};
export const example = {
  input: { bytes: [1, 2, 3], start: 1, width: 1 },
  output: { result: { bytes: [1, 0, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/checksum-field-zeroing",
  title: "Checksum Field Zeroing Tool",
  description:
    "Zero an explicitly bounded checksum field span in copied frame bytes; coverage and protocol layout remain caller responsibilities.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
