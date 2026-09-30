import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleSpend: number;
  readonly pendingSpend: number;
  readonly threshold: number;
};
export type Output = {
  readonly projectedSpend: number;
  readonly remainingSpend: number;
  readonly reached: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleSpend: { type: "number", minimum: 0 },
    pendingSpend: { type: "number", minimum: 0 },
    threshold: { type: "number", minimum: 0 },
  },
  required: ["eligibleSpend", "pendingSpend", "threshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectedSpend: { type: "number" },
    remainingSpend: { type: "number" },
    reached: { type: "boolean" },
  },
  required: ["projectedSpend", "remainingSpend", "reached"],
} as const;
/** Calculate loyalty tier spend progress margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleSpend, pendingSpend, threshold } = request;
  const compute = (): Output => {
    H.domain(eligibleSpend >= 0 && pendingSpend >= 0 && threshold >= 0);
    return {
      projectedSpend: eligibleSpend + pendingSpend,
      remainingSpend: Math.max(0, threshold - eligibleSpend - pendingSpend),
      reached: eligibleSpend + pendingSpend >= threshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligibleSpend: 70, pendingSpend: 20, threshold: 100 },
  output: { projectedSpend: 90, remainingSpend: 10, reached: false },
} satisfies ToolExample<Input, Output>;
export const loyaltyTierSpendProgressMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/loyalty-tier-spend-progress-margin",
    title: "Loyalty Tier Spend Progress Margin Tool",
    description:
      "Calculate loyalty tier spend progress margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleSpend: { type: "number", minimum: 0 },
        pendingSpend: { type: "number", minimum: 0 },
        threshold: { type: "number", minimum: 0 },
      },
      required: ["eligibleSpend", "pendingSpend", "threshold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        projectedSpend: { type: "number" },
        remainingSpend: { type: "number" },
        reached: { type: "boolean" },
      },
      required: ["projectedSpend", "remainingSpend", "reached"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleSpend",
          label: "Eligible Spend",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pendingSpend",
          label: "Pending Spend",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "projectedSpend",
          label: "Projected Spend",
          valueType: { type: "number" },
        },
        {
          id: "remainingSpend",
          label: "Remaining Spend",
          valueType: { type: "number" },
        },
        { id: "reached", label: "Reached", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = loyaltyTierSpendProgressMarginTool.execute;
export default loyaltyTierSpendProgressMarginTool;
