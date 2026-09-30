import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ top: number; tickSeconds: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "top", label: "Top", kind: "integer" },
  { id: "tickSeconds", label: "Tick seconds", kind: "number", unit: "s" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.top, 0, 0xffffffff);
  H.positive(i.tickSeconds);
  return H.finish({
    ticksPerPeriod: i.top + 1,
    periodSeconds: (i.top + 1) * i.tickSeconds,
  });
};
export const example = {
  input: { top: 9, tickSeconds: 0.01 },
  output: { result: { ticksPerPeriod: 10, periodSeconds: 0.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/timer-counter-inclusive-period",
  title: "Microcontroller: Timer Counter Inclusive Period Tool",
  description:
    "Compute an ideal up-counter period for inclusive counts zero through TOP with an explicitly supplied tick duration; excludes center-aligned modes.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          periodSeconds: { type: "number" },
          ticksPerPeriod: { type: "number" },
        },
        required: ["periodSeconds", "ticksPerPeriod"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
