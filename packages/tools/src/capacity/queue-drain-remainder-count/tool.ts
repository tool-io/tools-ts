import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ occupied: number; requested: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "occupied", kind: "integer", label: "occupied" },
  { id: "requested", kind: "integer", label: "requested" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.occupied);
  H.int(i.requested);
  const drained = Math.min(i.occupied, i.requested);
  return H.finish({
    drained,
    unfulfilled: i.requested - drained,
    remaining: i.occupied - drained,
  });
};
export const example = {
  input: { occupied: 3, requested: 5 },
  output: { result: { drained: 3, unfulfilled: 2, remaining: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/queue-drain-remainder-count",
  title: "Queue Drain Remainder Count",
  description:
    "Apply an explicit queue drain request with bounded available items; retain unfulfilled count instead of permitting negative occupancy.",
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
          drained: { type: "number" },
          unfulfilled: { type: "number" },
          remaining: { type: "number" },
        },
        required: ["drained", "unfulfilled", "remaining"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
