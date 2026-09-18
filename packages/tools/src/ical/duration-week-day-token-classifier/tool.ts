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
  const week = /^[+-]?P[0-9]+W(?![\s\S])/.test(i.token),
    day =
      /^[+-]?P(?:[0-9]+D)?(?:T(?:[0-9]+H)?(?:[0-9]+M)?(?:[0-9]+S)?)?(?![\s\S])/.test(
        i.token,
      ) &&
      /[0-9]/.test(i.token) &&
      !i.token.endsWith("T");
  H.check(week || day);
  return H.finish({
    form: week ? "weeks" : "days-time",
    negative: i.token.startsWith("-"),
  });
};
export const example = {
  input: { token: "-P2W" },
  output: { result: { form: "weeks", negative: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/duration-week-day-token-classifier",
  title: "iCalendar Duration Form Classifier",
  description:
    "Classify a restricted complete iCalendar duration as week-only or day/time form, rejecting mixed week/day and dangling time separators; does not convert calendar periods.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
