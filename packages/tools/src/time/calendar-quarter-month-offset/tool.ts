import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ month: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "month", kind: "integer", label: "month" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.month, 1, 12);
  return H.finish({
    quarter: Math.floor((i.month - 1) / 3) + 1,
    monthOffset: (i.month - 1) % 3,
  });
};
export const example = {
  input: { month: 5 },
  output: { result: { quarter: 2, monthOffset: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/calendar-quarter-month-offset",
  title: "Calendar Quarter Month Offset",
  description:
    "Locate an ordinary calendar month within its calendar quarter; zero-based month offset, not a fiscal-quarter mapping.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
