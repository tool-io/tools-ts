import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ escaped: H.icalEscape(i.text) });
};
export const example = {
  input: { text: "a,b;c\nx" },
  output: { result: { escaped: "a\\,b\\;c\\nx" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/text-value-escape",
  title: "iCalendar Text Value Escaper",
  description:
    "Escape iCalendar TEXT backslash, comma, semicolon and newline; lone CR is rejected, no colon or parameter encoding.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
