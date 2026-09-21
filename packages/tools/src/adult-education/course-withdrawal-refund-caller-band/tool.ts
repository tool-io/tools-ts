import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tuition: number;
  readonly completedFraction: number;
  readonly lowerFraction: number;
  readonly upperFraction: number;
  readonly refundFraction: number;
  readonly administrativeFee: number;
};
export type Output = {
  readonly inBand: boolean;
  readonly grossRefund: number;
  readonly netRefund: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tuition: { type: "number", minimum: 0 },
    completedFraction: { type: "number", minimum: 0, maximum: 1 },
    lowerFraction: { type: "number", minimum: 0 },
    upperFraction: { type: "number", maximum: 1 },
    refundFraction: { type: "number", minimum: 0, maximum: 1 },
    administrativeFee: { type: "number", minimum: 0 },
  },
  required: [
    "tuition",
    "completedFraction",
    "lowerFraction",
    "upperFraction",
    "refundFraction",
    "administrativeFee",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inBand: { type: "boolean" },
    grossRefund: { type: "number" },
    netRefund: { type: "number" },
  },
  required: ["inBand", "grossRefund", "netRefund"],
} as const;
/** One explicit lower-inclusive, upper-exclusive refund band; no institution policy is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    tuition,
    completedFraction,
    lowerFraction,
    upperFraction,
    refundFraction,
    administrativeFee,
  } = request;
  const compute = (): Output => {
    H.domain(
      tuition >= 0 &&
        administrativeFee >= 0 &&
        lowerFraction >= 0 &&
        upperFraction > lowerFraction &&
        upperFraction <= 1,
    );
    H.probability(completedFraction);
    H.probability(refundFraction);
    return {
      inBand:
        completedFraction >= lowerFraction && completedFraction < upperFraction,
      grossRefund:
        completedFraction >= lowerFraction && completedFraction < upperFraction
          ? tuition * refundFraction
          : 0,
      netRefund:
        completedFraction >= lowerFraction && completedFraction < upperFraction
          ? Math.max(0, tuition * refundFraction - administrativeFee)
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tuition: 1000,
    completedFraction: 0.2,
    lowerFraction: 0,
    upperFraction: 0.25,
    refundFraction: 0.8,
    administrativeFee: 50,
  },
  output: { inBand: true, grossRefund: 800, netRefund: 750 },
} satisfies ToolExample<Input, Output>;
export const courseWithdrawalRefundCallerBandTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/course-withdrawal-refund-caller-band",
    title: "Course Withdrawal Refund Caller Band Tool",
    description:
      "One explicit lower-inclusive, upper-exclusive refund band; no institution policy is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tuition: { type: "number", minimum: 0 },
        completedFraction: { type: "number", minimum: 0, maximum: 1 },
        lowerFraction: { type: "number", minimum: 0 },
        upperFraction: { type: "number", maximum: 1 },
        refundFraction: { type: "number", minimum: 0, maximum: 1 },
        administrativeFee: { type: "number", minimum: 0 },
      },
      required: [
        "tuition",
        "completedFraction",
        "lowerFraction",
        "upperFraction",
        "refundFraction",
        "administrativeFee",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inBand: { type: "boolean" },
        grossRefund: { type: "number" },
        netRefund: { type: "number" },
      },
      required: ["inBand", "grossRefund", "netRefund"],
    },
    ports: {
      inputs: [
        {
          id: "tuition",
          label: "Tuition",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "completedFraction",
          label: "Completed Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerFraction",
          label: "Lower Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperFraction",
          label: "Upper Fraction",
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
          id: "administrativeFee",
          label: "Administrative Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "inBand", label: "In Band", valueType: { type: "boolean" } },
        {
          id: "grossRefund",
          label: "Gross Refund",
          valueType: { type: "number" },
        },
        { id: "netRefund", label: "Net Refund", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = courseWithdrawalRefundCallerBandTool.execute;
export default courseWithdrawalRefundCallerBandTool;
