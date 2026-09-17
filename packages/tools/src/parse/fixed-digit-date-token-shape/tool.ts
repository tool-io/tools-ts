import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", kind: "string", label: "token" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^(\d{4})-(\d{2})-(\d{2})(?![\s\S])/.exec(i.token);
  H.check(m);
  return H.finish({
    year: Number(m![1]),
    month: Number(m![2]),
    day: Number(m![3]),
    calendarValidated: false,
  });
};
export const example = {
  input: { token: "2026-99-00" },
  output: {
    result: { year: 2026, month: 99, day: 0, calendarValidated: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/fixed-digit-date-token-shape",
  title: "Fixed Digit Date Token Shape Parser",
  description:
    "Parse fixed-width YYYY-MM-DD token shape only; intentionally preserves invalid calendar component values as unvalidated evidence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
