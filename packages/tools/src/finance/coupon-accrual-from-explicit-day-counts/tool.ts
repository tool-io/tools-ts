import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  couponAmount: number;
  elapsedDays: number;
  periodDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "couponAmount", label: "Coupon amount", kind: "number" },
  { id: "elapsedDays", label: "Elapsed days", kind: "integer" },
  { id: "periodDays", label: "Period days", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.couponAmount >= 0);
  H.int(i.periodDays, 1, 100000);
  H.int(i.elapsedDays, 0, i.periodDays);
  return H.finish({
    accruedCoupon: (i.couponAmount * i.elapsedDays) / i.periodDays,
  });
};
export const example = {
  input: { couponAmount: 30, elapsedDays: 45, periodDays: 180 },
  output: { result: { accruedCoupon: 7.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "finance/coupon-accrual-from-explicit-day-counts",
  title: "Finance: Coupon Accrual From Explicit Day Counts Tool",
  description:
    "Accrue one coupon using already resolved convention-consistent elapsed/period day counts; no calendar, ex-coupon or settlement convention inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { accruedCoupon: { type: "number" } },
        required: ["accruedCoupon"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
