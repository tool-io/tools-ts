import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossCharge: number;
  readonly refundablePart: number;
  readonly refundFraction: number;
  readonly alreadyRefunded: number;
};
export type Output = {
  readonly targetRefund: number;
  readonly remainingRefund: number;
  readonly retained: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossCharge: { type: "number", minimum: 0 },
    refundablePart: { type: "number", minimum: 0 },
    refundFraction: { type: "number", minimum: 0, maximum: 1 },
    alreadyRefunded: { type: "number", minimum: 0 },
  },
  required: [
    "grossCharge",
    "refundablePart",
    "refundFraction",
    "alreadyRefunded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetRefund: { type: "number" },
    remainingRefund: { type: "number" },
    retained: { type: "number" },
  },
  required: ["targetRefund", "remainingRefund", "retained"],
} as const;
/** Supplied charge/refund ledger arithmetic with signed outstanding refunds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossCharge, refundablePart, refundFraction, alreadyRefunded } =
    request;
  const compute = (): Output => {
    H.probability(refundFraction);
    H.domain(
      grossCharge >= 0 &&
        refundablePart >= 0 &&
        refundablePart <= grossCharge &&
        alreadyRefunded >= 0,
    );
    return {
      targetRefund: refundablePart * refundFraction,
      remainingRefund: refundablePart * refundFraction - alreadyRefunded,
      retained: grossCharge - refundablePart * refundFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossCharge: 100,
    refundablePart: 80,
    refundFraction: 0.5,
    alreadyRefunded: 10,
  },
  output: { targetRefund: 40, remainingRefund: 30, retained: 60 },
} satisfies ToolExample<Input, Output>;
export const qualityChargeRefundBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/quality-charge-refund-base",
    title: "Quality Charge Refund Base Tool",
    description:
      "Supplied charge/refund ledger arithmetic with signed outstanding refunds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossCharge: { type: "number", minimum: 0 },
        refundablePart: { type: "number", minimum: 0 },
        refundFraction: { type: "number", minimum: 0, maximum: 1 },
        alreadyRefunded: { type: "number", minimum: 0 },
      },
      required: [
        "grossCharge",
        "refundablePart",
        "refundFraction",
        "alreadyRefunded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetRefund: { type: "number" },
        remainingRefund: { type: "number" },
        retained: { type: "number" },
      },
      required: ["targetRefund", "remainingRefund", "retained"],
    },
    ports: {
      inputs: [
        {
          id: "grossCharge",
          label: "Gross Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refundablePart",
          label: "Refundable Part",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refundFraction",
          label: "Refund Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alreadyRefunded",
          label: "Already Refunded",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetRefund",
          label: "Target Refund",
          valueType: { type: "number" },
        },
        {
          id: "remainingRefund",
          label: "Remaining Refund",
          valueType: { type: "number" },
        },
        { id: "retained", label: "Retained", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = qualityChargeRefundBaseTool.execute;
export default qualityChargeRefundBaseTool;
