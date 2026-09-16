import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ year: number; month: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "year", kind: "integer", label: "year" },
  { id: "month", kind: "integer", label: "month" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.year, -1e6, 1e6);
  H.int(i.month, 1, 12);
  return H.finish({ index: i.year * 12 + i.month - 1 });
};
export const example = {
  input: { year: -1, month: 12 },
  output: { result: { index: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/calendar-month-index",
  title: "Calendar Month Linear Index",
  description:
    "Map proleptic year and 1\u201312 month to an exact linear month index with year zero; no day or timezone conversion.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
