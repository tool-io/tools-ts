import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  yesVotes: number;
  denominator: number;
  quotaNumerator: number;
  quotaDenominator: number;
  equalityPasses: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "yesVotes", label: "Yes votes", kind: "integer" },
  { id: "denominator", label: "Denominator", kind: "integer" },
  { id: "quotaNumerator", label: "Quota numerator", kind: "integer" },
  { id: "quotaDenominator", label: "Quota denominator", kind: "integer" },
  { id: "equalityPasses", label: "Equality passes", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.denominator, 1, 1000000);
  H.int(i.yesVotes, 0, i.denominator);
  H.int(i.quotaDenominator, 1, 1000000);
  H.int(i.quotaNumerator, 0, i.quotaDenominator);
  const left = i.yesVotes * i.quotaDenominator,
    right = i.denominator * i.quotaNumerator;
  return H.finish({
    meetsQuota: i.equalityPasses ? left >= right : left > right,
    atQuota: left === right,
  });
};
export const example = {
  input: {
    yesVotes: 5,
    denominator: 10,
    quotaNumerator: 1,
    quotaDenominator: 2,
    equalityPasses: false,
  },
  output: { result: { meetsQuota: false, atQuota: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "political-science/referendum-quota-equality-policy",
  title: "Political Science: Referendum Quota Equality Policy Tool",
  description:
    "Evaluate an explicit referendum-style rational quota using exact bounded cross products and a declared equality policy; not an electoral-law lookup.",
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
          atQuota: { type: "boolean" },
          meetsQuota: { type: "boolean" },
        },
        required: ["atQuota", "meetsQuota"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
