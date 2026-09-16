import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ hour: number; minute: number; second: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hour", kind: "integer", label: "hour" },
  { id: "minute", kind: "integer", label: "minute" },
  { id: "second", kind: "integer", label: "second" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.hour, 0, 23);
  H.int(i.minute, 0, 59);
  H.int(i.second, 0, 59);
  return H.finish({ seconds: i.hour * 3600 + i.minute * 60 + i.second });
};
export const example = {
  input: { hour: 1, minute: 1, second: 1 },
  output: { result: { seconds: 3661 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/clock-components-seconds-of-day",
  title: "Clock Components to Seconds Of Day",
  description:
    "Join validated ordinary civil clock components into seconds of day; leap-second 60 is not accepted.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
