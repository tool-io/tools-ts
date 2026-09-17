import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ demands: readonly number[]; budget: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "demands", kind: "numberList", label: "demands" },
  { id: "budget", kind: "integer", label: "budget" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.budget, 0, 1e6);
  i.demands.forEach((x) => H.int(x, 0, 1e6));
  const allocation = i.demands.map(() => 0);
  let remaining = i.budget;
  while (remaining) {
    let changed = false;
    for (let j = 0; j < allocation.length && remaining; j++)
      if (allocation[j] < i.demands[j]) {
        allocation[j]++;
        remaining--;
        changed = true;
      }
    if (!changed) break;
  }
  return H.finish({ allocation, remaining });
};
export const example = {
  input: { demands: [1, 3, 3], budget: 5 },
  output: { result: { allocation: [1, 2, 2], remaining: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/capacity-round-robin-budget-allocation",
  title: "Round Robin Budget Allocation",
  description:
    "Allocate integer capacity one unit per active demand in stable round-robin order, retaining unused budget once all demands are satisfied.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
