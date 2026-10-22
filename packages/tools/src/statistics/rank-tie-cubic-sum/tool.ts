import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ values: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "values", label: "values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({
    sum: H.rankBlocks(i.values).reduce((s, g) => {
      const n = g.indexes.length;
      return s + n ** 3 - n;
    }, 0),
  });
};
export const example = {
  input: { values: [1, 1, 2, 2, 2] },
  output: { result: { sum: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Rank Tie Cubic Sum"],
    collections: ["data", "learn"],
    fields: ["statistics"],
    keywords: [],
  },
  id: "statistics/rank-tie-cubic-sum",
  title: "Rank Tie Cubic Sum",
  description:
    "Sum t^3-t over exact numeric rank tie blocks for finite observations; no rank-test p-value or independence inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { sum: { type: "number" } },
        required: ["sum"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
