import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ window: number; serviceDuration: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "window", kind: "number", label: "window" },
  { id: "serviceDuration", kind: "number", label: "serviceDuration" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.window >= 0);
  H.positive(i.serviceDuration);
  const completed = Math.floor(i.window / i.serviceDuration);
  return H.finish({
    completed,
    unusedTime: i.window - completed * i.serviceDuration,
  });
};
export const example = {
  input: { window: 10, serviceDuration: 3 },
  output: { result: { completed: 3, unusedTime: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/queue-fixed-service-throughput-budget",
  title: "Queue Fixed Service Throughput Budget",
  description:
    "Budget complete equal-duration serial services in an explicit time window, retaining unused time; no parallelism or arrival model.",
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
          completed: { type: "number" },
          unusedTime: { type: "number" },
        },
        required: ["completed", "unusedTime"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
