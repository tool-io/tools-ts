import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ year: number; month: number; day: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "year", label: "year", kind: "integer" },
  { id: "month", label: "month", kind: "integer" },
  { id: "day", label: "day", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.dateValid(i.year, i.month, i.day);
  return H.finish({
    token:
      String(i.year).padStart(4, "0") +
      String(i.month).padStart(2, "0") +
      String(i.day).padStart(2, "0"),
  });
};
export const example = {
  input: { year: 2024, month: 2, day: 29 },
  output: { result: { token: "20240229" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/date-basic-token-formatter",
  title: "iCalendar Basic Date Token Formatter",
  description:
    "Format a validated proleptic Gregorian iCalendar basic date with year 1\u20139999; no time zone or floating date-time inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
