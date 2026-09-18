import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ values: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ text: i.values.map(H.icalEscape).join(",") });
};
export const example = {
  input: { values: ["a,b", "c"] },
  output: { result: { text: "a\\,b,c" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/text-list-value-join",
  title: "iCalendar Text List Value Joiner",
  description:
    "Format a literal iCalendar TEXT-list with per-value escaping, preserving empty elements and source order; no property-specific semantics.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
