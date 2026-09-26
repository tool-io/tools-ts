import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prepayments: number;
  readonly deliveredValue: number;
  readonly refundableShare: number;
  readonly priorRefunds: number;
};
export type Output = {
  readonly remainingPrepayment: number;
  readonly refundLiability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prepayments: { type: "number", minimum: 0 },
    deliveredValue: { type: "number", minimum: 0 },
    refundableShare: { type: "number", minimum: 0, maximum: 1 },
    priorRefunds: { type: "number", minimum: 0 },
  },
  required: [
    "prepayments",
    "deliveredValue",
    "refundableShare",
    "priorRefunds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingPrepayment: { type: "number" },
    refundLiability: { type: "number" },
  },
  required: ["remainingPrepayment", "refundLiability"],
} as const;
/** Calculate pilot refund liability term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prepayments, deliveredValue, refundableShare, priorRefunds } =
    request;
  const compute = (): Output => {
    H.domain(
      prepayments >= 0 &&
        deliveredValue >= 0 &&
        deliveredValue <= prepayments &&
        priorRefunds >= 0,
    );
    H.probability(refundableShare);
    return {
      remainingPrepayment: prepayments - deliveredValue,
      refundLiability:
        (prepayments - deliveredValue) * refundableShare - priorRefunds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    prepayments: 1000,
    deliveredValue: 400,
    refundableShare: 0.5,
    priorRefunds: 100,
  },
  output: { remainingPrepayment: 600, refundLiability: 200 },
} satisfies ToolExample<Input, Output>;
export const pilotRefundLiabilityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/pilot-refund-liability-term",
    title: "Pilot Refund Liability Term Tool",
    description:
      "Calculate pilot refund liability term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prepayments: { type: "number", minimum: 0 },
        deliveredValue: { type: "number", minimum: 0 },
        refundableShare: { type: "number", minimum: 0, maximum: 1 },
        priorRefunds: { type: "number", minimum: 0 },
      },
      required: [
        "prepayments",
        "deliveredValue",
        "refundableShare",
        "priorRefunds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingPrepayment: { type: "number" },
        refundLiability: { type: "number" },
      },
      required: ["remainingPrepayment", "refundLiability"],
    },
    ports: {
      inputs: [
        {
          id: "prepayments",
          label: "Prepayments",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deliveredValue",
          label: "Delivered Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refundableShare",
          label: "Refundable Share",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "priorRefunds",
          label: "Prior Refunds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingPrepayment",
          label: "Remaining Prepayment",
          valueType: { type: "number" },
        },
        {
          id: "refundLiability",
          label: "Refund Liability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pilotRefundLiabilityTermTool.execute;
export default pilotRefundLiabilityTermTool;
