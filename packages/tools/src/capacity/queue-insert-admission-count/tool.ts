import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  capacity: number;
  occupied: number;
  requested: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "capacity", kind: "integer", label: "capacity" },
  { id: "occupied", kind: "integer", label: "occupied" },
  { id: "requested", kind: "integer", label: "requested" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.capacity);
  H.int(i.occupied, 0, i.capacity);
  H.int(i.requested);
  const admitted = Math.min(i.requested, i.capacity - i.occupied);
  return H.finish({
    admitted,
    rejected: i.requested - admitted,
    occupied: i.occupied + admitted,
  });
};
export const example = {
  input: { capacity: 10, occupied: 7, requested: 5 },
  output: { result: { admitted: 3, rejected: 2, occupied: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/queue-insert-admission-count",
  title: "Queue Insert Admission Count",
  description:
    "Apply one bounded queue insertion request, retaining admitted/rejected counts and new occupancy; no concurrency or queueing forecast.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
