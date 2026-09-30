import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ gains: readonly number[]; firstRank: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "gains", label: "Gains", kind: "numberList" },
  { id: "firstRank", label: "First rank", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.gains.length > 0 && i.gains.every((x) => x >= 0));
  H.int(i.firstRank, 1, 1000000000);
  const mean = i.gains.reduce((s, x) => s + x, 0) / i.gains.length;
  return H.finish({
    meanGain: mean,
    discountedTieBlockGain:
      mean *
      i.gains.reduce((s, _, j) => s + 1 / Math.log2(i.firstRank + j + 1), 0),
  });
};
export const example = {
  input: { gains: [1, 3], firstRank: 1 },
  output: {
    result: { meanGain: 2, discountedTieBlockGain: 3.261859507142915 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/ranked-gain-tie-average-term",
  title: "Metrics: Ranked Gain Tie Average Term Tool",
  description:
    "Compute expected DCG contribution of one tied rank block by averaging supplied nonnegative gains across its explicit rank positions; no whole ranking metric.",
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
          discountedTieBlockGain: { type: "number" },
          meanGain: { type: "number" },
        },
        required: ["discountedTieBlockGain", "meanGain"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
