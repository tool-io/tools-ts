import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "days", kind: "integer", label: "days" },
  { id: "hours", kind: "integer", label: "hours" },
  { id: "minutes", kind: "integer", label: "minutes" },
  { id: "seconds", kind: "integer", label: "seconds" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  for (const v of [i.days, i.hours, i.minutes, i.seconds]) H.int(v, -1e9, 1e9);
  const t = i.days * 86400 + i.hours * 3600 + i.minutes * 60 + i.seconds,
    days = Math.floor(t / 86400),
    s = H.mod(t, 86400);
  return H.finish({
    days,
    hours: Math.floor(s / 3600),
    minutes: Math.floor(s / 60) % 60,
    seconds: s % 60,
  });
};
export const example = {
  input: { days: 0, hours: 0, minutes: 0, seconds: -1 },
  output: { result: { days: -1, hours: 23, minutes: 59, seconds: 59 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/duration-component-normalizer",
  title: "Duration Component Normalizer",
  description:
    "Normalize signed fixed-day duration components by floor division into a signed day count plus nonnegative subday components.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
