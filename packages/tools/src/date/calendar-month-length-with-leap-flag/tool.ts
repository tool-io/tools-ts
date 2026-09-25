import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ month: number; leapYear: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "month", label: "Month", kind: "integer" },
  { id: "leapYear", label: "Leap year", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.month, 1, 12);
  return H.finish({
    days: [31, i.leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
      i.month - 1
    ],
  });
};
export const example = {
  input: { month: 2, leapYear: true },
  output: { result: { days: 29 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/calendar-month-length-with-leap-flag",
  title: "Date: Calendar Month Length With Leap Flag Tool",
  description:
    "Return month length from an explicit Gregorian leap-year flag and one-based month; does not infer leap status from a year.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { days: { type: "number" } },
        required: ["days"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
