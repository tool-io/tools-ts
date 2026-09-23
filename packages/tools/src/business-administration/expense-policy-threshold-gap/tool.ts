import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expense: number;
  readonly reimbursableFraction: number;
  readonly suppliedThreshold: number;
  readonly includeEquality: boolean;
};
export type Output = {
  readonly eligibleAmount: number;
  readonly margin: number;
  readonly thresholdReached: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expense: { type: "number", minimum: 0 },
    reimbursableFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedThreshold: { type: "number", minimum: 0 },
    includeEquality: { type: "boolean" },
  },
  required: [
    "expense",
    "reimbursableFraction",
    "suppliedThreshold",
    "includeEquality",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleAmount: { type: "number" },
    margin: { type: "number" },
    thresholdReached: { type: "boolean" },
  },
  required: ["eligibleAmount", "margin", "thresholdReached"],
} as const;
/** Calculate expense policy threshold gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expense, reimbursableFraction, suppliedThreshold, includeEquality } =
    request;
  const compute = (): Output => {
    H.domain(expense >= 0 && suppliedThreshold >= 0);
    H.probability(reimbursableFraction);
    return (() => {
      const eligibleAmount = expense * reimbursableFraction,
        margin = eligibleAmount - suppliedThreshold;
      return {
        eligibleAmount,
        margin,
        thresholdReached: includeEquality ? margin >= 0 : margin > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    expense: 100,
    reimbursableFraction: 0.8,
    suppliedThreshold: 75,
    includeEquality: true,
  },
  output: { eligibleAmount: 80, margin: 5, thresholdReached: true },
} satisfies ToolExample<Input, Output>;
export const expensePolicyThresholdGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-administration/expense-policy-threshold-gap",
    title: "Expense Policy Threshold Gap Tool",
    description:
      "Calculate expense policy threshold gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expense: { type: "number", minimum: 0 },
        reimbursableFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedThreshold: { type: "number", minimum: 0 },
        includeEquality: { type: "boolean" },
      },
      required: [
        "expense",
        "reimbursableFraction",
        "suppliedThreshold",
        "includeEquality",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleAmount: { type: "number" },
        margin: { type: "number" },
        thresholdReached: { type: "boolean" },
      },
      required: ["eligibleAmount", "margin", "thresholdReached"],
    },
    ports: {
      inputs: [
        {
          id: "expense",
          label: "Expense",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reimbursableFraction",
          label: "Reimbursable Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedThreshold",
          label: "Supplied Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeEquality",
          label: "Include Equality",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "eligibleAmount",
          label: "Eligible Amount",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "thresholdReached",
          label: "Threshold Reached",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = expensePolicyThresholdGapTool.execute;
export default expensePolicyThresholdGapTool;
