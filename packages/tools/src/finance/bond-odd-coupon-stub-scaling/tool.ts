import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regularCoupon: number;
  readonly stubDays: number;
  readonly regularDays: number;
};
export type Output = { readonly stubCoupon: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regularCoupon: { type: "number" },
    stubDays: { type: "integer", minimum: 0 },
    regularDays: { type: "integer", minimum: 1 },
  },
  required: ["regularCoupon", "stubDays", "regularDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stubCoupon: { type: "number" } },
  required: ["stubCoupon"],
} as const;
/** Calculate bond odd coupon stub scaling from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regularCoupon, stubDays, regularDays } = request;
  const compute = (): Output => {
    H.integer(stubDays, 0);
    H.integer(regularDays, 1);
    return { stubCoupon: (regularCoupon * stubDays) / regularDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regularCoupon: 30, stubDays: 45, regularDays: 180 },
  output: { stubCoupon: 7.5 },
} satisfies ToolExample<Input, Output>;
export const bondOddCouponStubScalingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/bond-odd-coupon-stub-scaling",
    title: "Bond Odd Coupon Stub Scaling Tool",
    description:
      "Calculate bond odd coupon stub scaling from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regularCoupon: { type: "number" },
        stubDays: { type: "integer", minimum: 0 },
        regularDays: { type: "integer", minimum: 1 },
      },
      required: ["regularCoupon", "stubDays", "regularDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { stubCoupon: { type: "number" } },
      required: ["stubCoupon"],
    },
    ports: {
      inputs: [
        {
          id: "regularCoupon",
          label: "Regular Coupon",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stubDays",
          label: "Stub Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "regularDays",
          label: "Regular Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "stubCoupon",
          label: "Stub Coupon",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bondOddCouponStubScalingTool.execute;
export default bondOddCouponStubScalingTool;
