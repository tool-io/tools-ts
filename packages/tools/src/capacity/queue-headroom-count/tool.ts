import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ capacity: number; occupied: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "capacity", kind: "integer", label: "capacity" },
  { id: "occupied", kind: "integer", label: "occupied" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.capacity);
  H.int(i.occupied, 0, i.capacity);
  return H.finish({
    headroom: i.capacity - i.occupied,
    utilization: i.capacity ? i.occupied / i.capacity : null,
  });
};
export const example = {
  input: { capacity: 10, occupied: 7 },
  output: { result: { headroom: 3, utilization: 0.7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/queue-headroom-count",
  title: "Queue Headroom Count",
  description:
    "Report bounded queue headroom and utilization from explicit counts; zero-capacity utilization is unknown/null.",
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
          headroom: { type: "number" },
          utilization: { anyOf: [{ type: "number" }, { type: "null" }] },
        },
        required: ["headroom", "utilization"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
