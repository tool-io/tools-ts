import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly limit: number;
  readonly approved: number;
  readonly pending: number;
  readonly countPending: boolean;
};
export type Output = {
  readonly remaining: number;
  readonly countedCommitment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    limit: { type: "number", minimum: 0 },
    approved: { type: "number", minimum: 0 },
    pending: { type: "number", minimum: 0 },
    countPending: { type: "boolean" },
  },
  required: ["limit", "approved", "pending", "countPending"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "number" },
    countedCommitment: { type: "number" },
  },
  required: ["remaining", "countedCommitment"],
} as const;
/** Supplied administrative approval-budget accounting without determining authority or policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { limit, approved, pending, countPending } = request;
  const compute = (): Output => {
    H.domain(limit >= 0 && approved >= 0 && pending >= 0);
    return {
      remaining: limit - approved - (countPending ? pending : 0),
      countedCommitment: approved + (countPending ? pending : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { limit: 1000, approved: 600, pending: 200, countPending: true },
  output: { remaining: 200, countedCommitment: 800 },
} satisfies ToolExample<Input, Output>;
export const approvalLimitRemainingCapacityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-administration/approval-limit-remaining-capacity",
    title: "Approval Limit Remaining Capacity Tool",
    description:
      "Supplied administrative approval-budget accounting without determining authority or policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        limit: { type: "number", minimum: 0 },
        approved: { type: "number", minimum: 0 },
        pending: { type: "number", minimum: 0 },
        countPending: { type: "boolean" },
      },
      required: ["limit", "approved", "pending", "countPending"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        countedCommitment: { type: "number" },
      },
      required: ["remaining", "countedCommitment"],
    },
    ports: {
      inputs: [
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "approved",
          label: "Approved",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pending",
          label: "Pending",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countPending",
          label: "Count Pending",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        {
          id: "countedCommitment",
          label: "Counted Commitment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = approvalLimitRemainingCapacityTool.execute;
export default approvalLimitRemainingCapacityTool;
