import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  cells: readonly string[];
  widths: readonly number[];
  pad: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cells", kind: "stringList", label: "cells" },
  { id: "widths", kind: "numberList", label: "widths" },
  { id: "pad", kind: "string", label: "pad" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.cells.length === i.widths.length && i.pad.length === 1);
  const parts = i.cells.map((s, j) => {
    H.int(i.widths[j], 0, 8192);
    H.check(s.length <= i.widths[j]);
    return s.padEnd(i.widths[j], i.pad);
  });
  return H.finish({ record: parts.join("") });
};
export const example = {
  input: { cells: ["a", "bc"], widths: [3, 3], pad: " " },
  output: { result: { record: "a  bc " } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/fixed-width-record-padder",
  title: "Fixed Width Record Padder",
  description:
    "Pad caller cells into explicit UTF-16 fixed-width fields; overflow is rejected instead of silently truncated.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
