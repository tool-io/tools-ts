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
    negative: i.values.filter((x) => x < 0).length,
    zero: i.values.filter((x) => x === 0).length,
    positive: i.values.filter((x) => x > 0).length,
  });
};
export const example = {
  input: { values: [-1, 0, 2, 3] },
  output: { result: { negative: 1, zero: 1, positive: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Finite Value Sign Counts"],
    collections: ["data", "learn"],
    fields: ["statistics"],
    keywords: [],
  },
  id: "statistics/finite-value-sign-counts",
  title: "Finite Value Sign Counts",
  description:
    "Count sign classes of explicitly finite observations, treating signed zero as zero and rejecting nonfinite values rather than dropping them.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          negative: { type: "number" },
          zero: { type: "number" },
          positive: { type: "number" },
        },
        required: ["negative", "zero", "positive"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
