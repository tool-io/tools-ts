import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ value: number; start: number; end: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", kind: "integer", label: "value" },
  { id: "start", kind: "integer", label: "start" },
  { id: "end", kind: "integer", label: "end" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.clock(i.value);
  H.clock(i.start);
  H.clock(i.end);
  return H.finish({
    member:
      i.start < i.end
        ? i.value >= i.start && i.value < i.end
        : i.start > i.end
          ? i.value >= i.start || i.value < i.end
          : false,
  });
};
export const example = {
  input: { value: 100, start: 80000, end: 200 },
  output: { result: { member: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/clock-value-window-membership",
  title: "Clock Value Window Membership",
  description:
    "Test half-open forward clock-window membership including overnight wrap; equal endpoints denote an empty window.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
