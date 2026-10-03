import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly approvedDay: number;
  readonly reviewInterval: number;
  readonly observationDay: number;
  readonly suspended: boolean;
};
export type Output = {
  readonly reviewDueDay: number;
  readonly daysRemaining: number;
  readonly reviewOverdue: boolean;
  readonly usableUnderFlags: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    approvedDay: { type: "integer" },
    reviewInterval: { type: "integer", minimum: 1 },
    observationDay: { type: "integer" },
    suspended: { type: "boolean" },
  },
  required: ["approvedDay", "reviewInterval", "observationDay", "suspended"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reviewDueDay: { type: "integer" },
    daysRemaining: { type: "integer" },
    reviewOverdue: { type: "boolean" },
    usableUnderFlags: { type: "boolean" },
  },
  required: [
    "reviewDueDay",
    "daysRemaining",
    "reviewOverdue",
    "usableUnderFlags",
  ],
} as const;
/** Audit a supplied supplier approval review interval and suspension flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { approvedDay, reviewInterval, observationDay, suspended } = request;
  const compute = (): Output => {
    H.integer(reviewInterval, 1);
    H.domain(observationDay >= approvedDay);
    const reviewDueDay = approvedDay + reviewInterval,
      reviewOverdue = observationDay > reviewDueDay;
    return {
      reviewDueDay,
      daysRemaining: reviewDueDay - observationDay,
      reviewOverdue,
      usableUnderFlags: !suspended && !reviewOverdue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    approvedDay: 100,
    reviewInterval: 30,
    observationDay: 125,
    suspended: false,
  },
  output: {
    reviewDueDay: 130,
    daysRemaining: 5,
    reviewOverdue: false,
    usableUnderFlags: true,
  },
} satisfies ToolExample<Input, Output>;
export const supplierApprovalReviewExpiryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/supplier-approval-review-expiry-term",
    title: "Supplier Approval Review Expiry Term Tool",
    description:
      "Audit a supplied supplier approval review interval and suspension flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        approvedDay: { type: "integer" },
        reviewInterval: { type: "integer", minimum: 1 },
        observationDay: { type: "integer" },
        suspended: { type: "boolean" },
      },
      required: [
        "approvedDay",
        "reviewInterval",
        "observationDay",
        "suspended",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reviewDueDay: { type: "integer" },
        daysRemaining: { type: "integer" },
        reviewOverdue: { type: "boolean" },
        usableUnderFlags: { type: "boolean" },
      },
      required: [
        "reviewDueDay",
        "daysRemaining",
        "reviewOverdue",
        "usableUnderFlags",
      ],
    },
    ports: {
      inputs: [
        {
          id: "approvedDay",
          label: "Approved Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reviewInterval",
          label: "Review Interval",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationDay",
          label: "Observation Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suspended",
          label: "Suspended",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reviewDueDay",
          label: "Review Due Day",
          valueType: { type: "integer" },
        },
        {
          id: "daysRemaining",
          label: "Days Remaining",
          valueType: { type: "integer" },
        },
        {
          id: "reviewOverdue",
          label: "Review Overdue",
          valueType: { type: "boolean" },
        },
        {
          id: "usableUnderFlags",
          label: "Usable Under Flags",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = supplierApprovalReviewExpiryTermTool.execute;
export default supplierApprovalReviewExpiryTermTool;
