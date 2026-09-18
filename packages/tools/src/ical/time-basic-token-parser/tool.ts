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
  return H.finish(H.timeBasic(i.token));
};
export const example = {
  input: { token: "235960Z" },
  output: { result: { hour: 23, minute: 59, second: 60, utc: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/time-basic-token-parser",
  title: "iCalendar Basic Time Token Parser",
  description:
    "Parse strict iCalendar basic time with optional UTC marker and allowed second 60; does not validate leap-second scheduling or resolve time zones.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
