import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ seconds: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seconds", kind: "integer", label: "seconds" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.clock(i.seconds);
  return H.finish({
    hour: Math.floor(i.seconds / 3600),
    minute: Math.floor(i.seconds / 60) % 60,
    second: i.seconds % 60,
  });
};
export const example = {
  input: { seconds: 3661 },
  output: { result: { hour: 1, minute: 1, second: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/seconds-of-day-split",
  title: "Seconds Of Day Splitter",
  description:
    "Split integer civil seconds of day into 24-hour clock components; no dates, zones or leap seconds.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
