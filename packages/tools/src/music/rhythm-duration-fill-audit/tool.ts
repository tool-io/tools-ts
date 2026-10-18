import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ durations: readonly number[]; budget: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "durations", kind: "numberList", label: "durations" },
  { id: "budget", kind: "integer", label: "budget" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  i.durations.forEach((x) => H.int(x));
  H.int(i.budget);
  const total = i.durations.reduce((s, x) => s + x, 0);
  return H.finish({
    total,
    remainder: i.budget - total,
    exact: total === i.budget,
    overflow: total > i.budget,
  });
};
export const example = {
  input: { durations: [3, 4], budget: 6 },
  output: { result: { total: 7, remainder: -1, exact: false, overflow: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/rhythm-duration-fill-audit",
  title: "Rhythm Duration Fill Audit",
  description:
    "Audit integer rhythm duration fill against an explicit tick budget, retaining negative overshoot rather than clamping.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          total: { type: "number" },
          remainder: { type: "number" },
          exact: { type: "boolean" },
          overflow: { type: "boolean" },
        },
        required: ["total", "remainder", "exact", "overflow"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
