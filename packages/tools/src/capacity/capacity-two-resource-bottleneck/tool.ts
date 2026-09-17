import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  resourceA: number;
  resourceB: number;
  perItemA: number;
  perItemB: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "resourceA", kind: "number", label: "resourceA" },
  { id: "resourceB", kind: "number", label: "resourceB" },
  { id: "perItemA", kind: "number", label: "perItemA" },
  { id: "perItemB", kind: "number", label: "perItemB" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.resourceA >= 0 && i.resourceB >= 0);
  H.positive(i.perItemA);
  H.positive(i.perItemB);
  const countA = Math.floor(i.resourceA / i.perItemA),
    countB = Math.floor(i.resourceB / i.perItemB);
  return H.finish({
    items: Math.min(countA, countB),
    bottlenecks:
      countA === countB ? ["A", "B"] : countA < countB ? ["A"] : ["B"],
  });
};
export const example = {
  input: { resourceA: 10, resourceB: 12, perItemA: 3, perItemB: 4 },
  output: { result: { items: 3, bottlenecks: ["A", "B"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/capacity-two-resource-bottleneck",
  title: "Two Resource Capacity Bottleneck",
  description:
    "Count complete items under two explicitly positive per-item resource requirements, retaining tied limiting resources.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
