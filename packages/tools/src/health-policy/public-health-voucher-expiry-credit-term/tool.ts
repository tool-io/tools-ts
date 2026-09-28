import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly faceValue: number;
  readonly redeemed: number;
  readonly expiryDay: number;
  readonly useDay: number;
  readonly inclusive: boolean;
  readonly refundableFraction: number;
};
export type Output = {
  readonly unspent: number;
  readonly usableCredit: number;
  readonly refundableCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    faceValue: { type: "number" },
    redeemed: { type: "number", minimum: 0 },
    expiryDay: { type: "integer" },
    useDay: { type: "integer" },
    inclusive: { type: "boolean" },
    refundableFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "faceValue",
    "redeemed",
    "expiryDay",
    "useDay",
    "inclusive",
    "refundableFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unspent: { type: "number" },
    usableCredit: { type: "number" },
    refundableCredit: { type: "number" },
  },
  required: ["unspent", "usableCredit", "refundableCredit"],
} as const;
/** Calculate public health voucher expiry credit term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    faceValue,
    redeemed,
    expiryDay,
    useDay,
    inclusive,
    refundableFraction,
  } = request;
  const compute = (): Output => {
    H.domain(faceValue >= redeemed && redeemed >= 0);
    H.probability(refundableFraction);
    return {
      unspent: faceValue - redeemed,
      usableCredit: (inclusive ? useDay <= expiryDay : useDay < expiryDay)
        ? faceValue - redeemed
        : 0,
      refundableCredit: (inclusive ? useDay <= expiryDay : useDay < expiryDay)
        ? 0
        : (faceValue - redeemed) * refundableFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    faceValue: 100,
    redeemed: 30,
    expiryDay: 100,
    useDay: 101,
    inclusive: true,
    refundableFraction: 0.5,
  },
  output: { unspent: 70, usableCredit: 0, refundableCredit: 35 },
} satisfies ToolExample<Input, Output>;
export const publicHealthVoucherExpiryCreditTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-policy/public-health-voucher-expiry-credit-term",
      title: "Public Health Voucher Expiry Credit Term Tool",
      description:
        "Calculate public health voucher expiry credit term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          faceValue: { type: "number" },
          redeemed: { type: "number", minimum: 0 },
          expiryDay: { type: "integer" },
          useDay: { type: "integer" },
          inclusive: { type: "boolean" },
          refundableFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "faceValue",
          "redeemed",
          "expiryDay",
          "useDay",
          "inclusive",
          "refundableFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unspent: { type: "number" },
          usableCredit: { type: "number" },
          refundableCredit: { type: "number" },
        },
        required: ["unspent", "usableCredit", "refundableCredit"],
      },
      ports: {
        inputs: [
          {
            id: "faceValue",
            label: "Face Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "redeemed",
            label: "Redeemed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "expiryDay",
            label: "Expiry Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "useDay",
            label: "Use Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "inclusive",
            label: "Inclusive",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "refundableFraction",
            label: "Refundable Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "unspent", label: "Unspent", valueType: { type: "number" } },
          {
            id: "usableCredit",
            label: "Usable Credit",
            valueType: { type: "number" },
          },
          {
            id: "refundableCredit",
            label: "Refundable Credit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicHealthVoucherExpiryCreditTermTool.execute;
export default publicHealthVoucherExpiryCreditTermTool;
