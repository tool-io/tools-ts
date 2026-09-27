import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  quantity: number;
  unitPrice: number;
  fixedFee: number;
  side: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "quantity", label: "Quantity", kind: "number" },
  { id: "unitPrice", label: "Unit price", kind: "number" },
  { id: "fixedFee", label: "Fixed fee", kind: "number" },
  { id: "side", label: "Side", kind: "string", enum: ["buy", "sell"] },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.quantity >= 0 && i.unitPrice >= 0 && i.fixedFee >= 0);
  H.choice(i.side, ["buy", "sell"]);
  return H.finish({
    signedCashFlow:
      (i.side === "sell" ? 1 : -1) * i.quantity * i.unitPrice - i.fixedFee,
  });
};
export const example = {
  input: { quantity: 2, unitPrice: 10, fixedFee: 1, side: "sell" },
  output: { result: { signedCashFlow: 19 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "finance/trade-cash-flow-with-fixed-fee",
  title: "Finance: Trade Cash Flow With Fixed Fee Tool",
  description:
    "Compute a single buy/sell signed cash flow including a supplied nonnegative fixed fee; excludes taxes, settlement and price advice.",
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
