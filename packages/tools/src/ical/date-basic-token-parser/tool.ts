import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish(H.dateBasic(i.token));
};
export const example = {
  input: { token: "20240229" },
  output: { result: { year: 2024, month: 2, day: 29 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/date-basic-token-parser",
  title: "iCalendar Basic Date Token Parser",
  description:
    "Parse and calendar-validate one strict YYYYMMDD iCalendar basic date, including Gregorian leap rules; no timestamp conversion.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
