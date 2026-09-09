import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, money } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedVisitorCount: number;
  readonly observedPurchasingVisitorCount: number;
  readonly observedNetShopRevenueMinor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedVisitorCount",
    label: "Observed visitor count",
    kind: "number",
  },
  {
    id: "observedPurchasingVisitorCount",
    label: "Observed purchasing visitor count",
    kind: "number",
  },
  {
    id: "observedNetShopRevenueMinor",
    label: "Observed net shop revenue minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.observedVisitorCount, "visitors", 1, 1000000000);
  bounded(
    input.observedPurchasingVisitorCount,
    "purchasers",
    1,
    input.observedVisitorCount,
  );
  money(input.observedNetShopRevenueMinor, "revenue");
  return {
    observedShopConversionPercent:
      (100 * input.observedPurchasingVisitorCount) / input.observedVisitorCount,
    observedRevenueMinorPerVisitor:
      input.observedNetShopRevenueMinor / input.observedVisitorCount,
    observedRevenueMinorPerPurchasingVisitor:
      input.observedNetShopRevenueMinor / input.observedPurchasingVisitorCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedVisitorCount: 100,
    observedPurchasingVisitorCount: 20,
    observedNetShopRevenueMinor: 5000,
  },
  output: {
    result: {
      observedShopConversionPercent: 20,
      observedRevenueMinorPerVisitor: 50,
      observedRevenueMinorPerPurchasingVisitor: 250,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/gift-shop-spend-per-head",
  title: "Gift Shop Conversion Rate Spend per Head Calculator",
  description:
    "Actual matched visitor/purchaser shop ledger yields; denominators count people not transactions. Mean monetary yields are ratios, not payment-rounded amounts or causal merchandising performance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
