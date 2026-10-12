import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ costs: readonly number[]; budget: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "costs", kind: "numberList", label: "costs" },
  { id: "budget", kind: "number", label: "budget" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.budget >= 0 && i.costs.every((x) => x >= 0));
  let used = 0,
    count = 0;
  for (const cost of i.costs) {
    if (used + cost > i.budget) break;
    used += cost;
    count++;
  }
  return H.finish({
    admittedCount: count,
    used,
    remainder: i.budget - used,
    rejectedIndexes: i.costs.slice(count).map((_, j) => j + count),
  });
};
export const example = {
  input: { costs: [2, 5, 1], budget: 6 },
  output: {
    result: {
      admittedCount: 1,
      used: 2,
      remainder: 4,
      rejectedIndexes: [1, 2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/capacity-per-item-prefix-admission",
  title: "Per Item Prefix Capacity Admission",
  description:
    "Admit only the longest affordable ordered prefix of explicit per-item costs; after the first failure later cheaper items are not skipped into admission.",
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
          admittedCount: { type: "number" },
          used: { type: "number" },
          remainder: { type: "number" },
          rejectedIndexes: { type: "array", items: { type: "number" } },
        },
        required: ["admittedCount", "used", "remainder", "rejectedIndexes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
