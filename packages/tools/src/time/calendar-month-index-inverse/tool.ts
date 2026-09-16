import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ index: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", kind: "integer", label: "index" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.index, -12e6, 12e6);
  return H.finish({
    year: Math.floor(i.index / 12),
    month: H.mod(i.index, 12) + 1,
  });
};
export const example = {
  input: { index: -1 },
  output: { result: { year: -1, month: 12 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/calendar-month-index-inverse",
  title: "Calendar Month Linear Index Inverse",
  description:
    "Invert a signed linear proleptic month index using floor division and astronomical year zero.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
