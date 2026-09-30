import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly suppliedLimit: number;
  readonly priorCommitments: number;
  readonly inclusive: boolean;
};
export type Output = {
  readonly totalCommitment: number;
  readonly margin: number;
  readonly withinByInputs: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number", minimum: 0 },
    suppliedLimit: { type: "number", minimum: 0 },
    priorCommitments: { type: "number", minimum: 0 },
    inclusive: { type: "boolean" },
  },
  required: ["amount", "suppliedLimit", "priorCommitments", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCommitment: { type: "number" },
    margin: { type: "number" },
    withinByInputs: { type: "boolean" },
  },
  required: ["totalCommitment", "margin", "withinByInputs"],
} as const;
/** Calculate delegated authority amount margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, suppliedLimit, priorCommitments, inclusive } = request;
  const compute = (): Output => {
    H.domain(amount >= 0 && suppliedLimit >= 0 && priorCommitments >= 0);
    return {
      totalCommitment: amount + priorCommitments,
      margin: suppliedLimit - amount - priorCommitments,
      withinByInputs: inclusive
        ? amount + priorCommitments <= suppliedLimit
        : amount + priorCommitments < suppliedLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    amount: 80,
    suppliedLimit: 100,
    priorCommitments: 20,
    inclusive: true,
  },
  output: { totalCommitment: 100, margin: 0, withinByInputs: true },
} satisfies ToolExample<Input, Output>;
export const delegatedAuthorityAmountMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/delegated-authority-amount-margin",
    title: "Delegated Authority Amount Margin Tool",
    description:
      "Calculate delegated authority amount margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number", minimum: 0 },
        suppliedLimit: { type: "number", minimum: 0 },
        priorCommitments: { type: "number", minimum: 0 },
        inclusive: { type: "boolean" },
      },
      required: ["amount", "suppliedLimit", "priorCommitments", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCommitment: { type: "number" },
        margin: { type: "number" },
        withinByInputs: { type: "boolean" },
      },
      required: ["totalCommitment", "margin", "withinByInputs"],
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
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priorCommitments",
          label: "Prior Commitments",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "totalCommitment",
          label: "Total Commitment",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "withinByInputs",
          label: "Within By Inputs",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = delegatedAuthorityAmountMarginTool.execute;
export default delegatedAuthorityAmountMarginTool;
