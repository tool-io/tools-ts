import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ boundaries: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "boundaries", label: "boundaries", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const stack: string[] = [],
    errors: { index: number; expected: string | null; observed: string }[] = [];
  i.boundaries.forEach((s, index) => {
    const m = /^(BEGIN|END):([A-Za-z0-9-]+)(?![\s\S])/i.exec(s);
    H.check(m);
    const name = m![2].toUpperCase();
    if (m![1].toUpperCase() === "BEGIN") stack.push(name);
    else if (stack.at(-1) === name) stack.pop();
    else errors.push({ index, expected: stack.at(-1) ?? null, observed: name });
  });
  return H.finish({
    valid: errors.length === 0 && stack.length === 0,
    errors,
    unclosed: stack,
  });
};
export const example = {
  input: { boundaries: ["BEGIN:VCALENDAR", "BEGIN:VEVENT", "END:VCALENDAR"] },
  output: {
    result: {
      valid: false,
      errors: [{ index: 2, expected: "VEVENT", observed: "VCALENDAR" }],
      unclosed: ["VCALENDAR", "VEVENT"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/component-boundary-stack-audit",
  title: "iCalendar Component Boundary Stack Audit",
  description:
    "Audit explicit iCalendar BEGIN/END boundary tokens using a stack, retaining mismatches and unclosed components; not complete property/component semantic validation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
