import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  amount: number;
  direction: string;
  perspective: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "amount", label: "Amount", kind: "number" },
  {
    id: "direction",
    label: "Direction",
    kind: "string",
    enum: ["borrower", "lender"],
  },
  {
    id: "perspective",
    label: "Perspective",
    kind: "string",
    enum: ["borrower", "lender"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.amount >= 0);
  H.choice(i.direction, ["borrower", "lender"]);
  H.choice(i.perspective, ["borrower", "lender"]);
  return H.finish({
    signedCashFlow: (i.direction === i.perspective ? 1 : -1) * i.amount,
  });
};
export const example = {
  input: { amount: 10, direction: "borrower", perspective: "lender" },
  output: { result: { signedCashFlow: -10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "finance/cash-flow-payment-sign-convention",
  title: "Finance: Cash Flow Payment Sign Convention Tool",
  description:
    "Assign a cash-flow sign to a transfer explicitly directed toward borrower or lender under the selected recipient perspective.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedCashFlow: { type: "number" } },
        required: ["signedCashFlow"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
