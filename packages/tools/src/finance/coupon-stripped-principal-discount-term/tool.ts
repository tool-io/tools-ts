import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly principal: number;
  readonly yieldRate: number;
  readonly periods: number;
};
export type Output = { readonly presentValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    principal: { type: "number", minimum: 0 },
    yieldRate: { type: "number", exclusiveMinimum: -1 },
    periods: { type: "number", minimum: 0 },
  },
  required: ["principal", "yieldRate", "periods"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { presentValue: { type: "number" } },
  required: ["presentValue"],
} as const;
/** Calculate coupon stripped principal discount term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { principal, yieldRate, periods } = request;
  const compute = (): Output => {
    H.domain(principal >= 0 && periods >= 0 && yieldRate > -1);
    return { presentValue: principal / (1 + yieldRate) ** periods };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { principal: 1000, yieldRate: 0.1, periods: 2 },
  output: { presentValue: 826.4462809917354 },
} satisfies ToolExample<Input, Output>;
export const couponStrippedPrincipalDiscountTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "finance/coupon-stripped-principal-discount-term",
      title: "Coupon Stripped Principal Discount Term Tool",
      description:
        "Calculate coupon stripped principal discount term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          principal: { type: "number", minimum: 0 },
          yieldRate: { type: "number", exclusiveMinimum: -1 },
          periods: { type: "number", minimum: 0 },
        },
        required: ["principal", "yieldRate", "periods"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { presentValue: { type: "number" } },
        required: ["presentValue"],
      },
      ports: {
        inputs: [
          {
            id: "principal",
            label: "Principal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "yieldRate",
            label: "Yield Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "periods",
            label: "Periods",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "presentValue",
            label: "Present Value",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = couponStrippedPrincipalDiscountTermTool.execute;
export default couponStrippedPrincipalDiscountTermTool;
