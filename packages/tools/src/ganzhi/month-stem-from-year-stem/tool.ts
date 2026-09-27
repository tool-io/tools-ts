import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  yearStemIndex: number;
  monthBranchIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "yearStemIndex", label: "Year stem index", kind: "integer" },
  { id: "monthBranchIndex", label: "Month branch index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.yearStemIndex, 0, 9);
  H.int(i.monthBranchIndex, 0, 11);
  return H.finish({
    monthStemIndex: H.mod(
      2 * (i.yearStemIndex % 5) + 2 + H.mod(i.monthBranchIndex - 2, 12),
      10,
    ),
  });
};
export const example = {
  input: { yearStemIndex: 0, monthBranchIndex: 2 },
  output: { result: { monthStemIndex: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ganzhi/month-stem-from-year-stem",
  title: "Month Heavenly Stem Calculator",
  description:
    "Apply the five-tiger month-stem rule to an already resolved solar-month branch, with Yin=2 as the first month; no lunar-month substitution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { monthStemIndex: { type: "number" } },
        required: ["monthStemIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
