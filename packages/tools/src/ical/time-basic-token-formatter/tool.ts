import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  hour: number;
  minute: number;
  second: number;
  utc: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hour", label: "hour", kind: "integer" },
  { id: "minute", label: "minute", kind: "integer" },
  { id: "second", label: "second", kind: "integer" },
  { id: "utc", label: "utc", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.hour, 0, 23);
  H.int(i.minute, 0, 59);
  H.int(i.second, 0, 60);
  return H.finish({
    token:
      String(i.hour).padStart(2, "0") +
      String(i.minute).padStart(2, "0") +
      String(i.second).padStart(2, "0") +
      (i.utc ? "Z" : ""),
  });
};
export const example = {
  input: { hour: 1, minute: 2, second: 3, utc: true },
  output: { result: { token: "010203Z" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/time-basic-token-formatter",
  title: "iCalendar Basic Time Token Formatter",
  description:
    "Format validated iCalendar HHMMSS with optional Z; second 60 is retained as explicit leap-second notation, not proof of a real leap second.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
