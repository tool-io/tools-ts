import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly limit: number;
  readonly equalityWithinLimit: boolean;
};
export type Output = {
  readonly withinLimit: boolean;
  readonly boundary: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number", minimum: 0 },
    limit: { type: "number", minimum: 0 },
    equalityWithinLimit: { type: "boolean" },
  },
  required: ["amount", "limit", "equalityWithinLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withinLimit: { type: "boolean" },
    boundary: { type: "string", maxLength: 8192 },
  },
  required: ["withinLimit", "boundary"],
} as const;
/** Apply an explicit inclusive/exclusive boundary rule to a supplied approval limit; no authority is granted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, limit, equalityWithinLimit } = request;
  const compute = (): Output => {
    H.domain(amount >= 0 && limit >= 0, "amount");
    return {
      withinLimit: amount < limit || (amount === limit && equalityWithinLimit),
      boundary:
        amount === limit
          ? "at-limit"
          : amount < limit
            ? "below-limit"
            : "above-limit",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amount: 1000, limit: 1000, equalityWithinLimit: true },
  output: { withinLimit: true, boundary: "at-limit" },
} satisfies ToolExample<Input, Output>;
export const approvalLimitBoundaryLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/approval-limit-boundary-label",
    title: "Approval Limit Boundary Label Tool",
    description:
      "Apply an explicit inclusive/exclusive boundary rule to a supplied approval limit; no authority is granted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number", minimum: 0 },
        limit: { type: "number", minimum: 0 },
        equalityWithinLimit: { type: "boolean" },
      },
      required: ["amount", "limit", "equalityWithinLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withinLimit: { type: "boolean" },
        boundary: { type: "string", maxLength: 8192 },
      },
      required: ["withinLimit", "boundary"],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityWithinLimit",
          label: "Equality Within Limit",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "withinLimit",
          label: "Within Limit",
          valueType: { type: "boolean" },
        },
        { id: "boundary", label: "Boundary", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = approvalLimitBoundaryLabelTool.execute;
export default approvalLimitBoundaryLabelTool;
