import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ start: number; end: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", kind: "integer", label: "start" },
  { id: "end", kind: "integer", label: "end" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.clock(i.start);
  H.clock(i.end);
  return H.finish({
    crossesMidnight: i.end < i.start,
    forwardDuration: H.mod(i.end - i.start, 86400),
  });
};
export const example = {
  input: { start: 80000, end: 100 },
  output: { result: { crossesMidnight: true, forwardDuration: 6500 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/clock-range-crosses-midnight",
  title: "Clock Range Crosses Midnight",
  description:
    "Classify a forward civil clock range; equal endpoints mean empty, not an implicit full day.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
