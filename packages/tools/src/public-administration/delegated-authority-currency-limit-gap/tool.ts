import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly proposedAmount: number;
  readonly suppliedAuthorityLimit: number;
};
export type Output = {
  readonly remainingLimit: number;
  readonly withinSuppliedAmountLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proposedAmount: { type: "number", minimum: 0 },
    suppliedAuthorityLimit: { type: "number", minimum: 0 },
  },
  required: ["proposedAmount", "suppliedAuthorityLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingLimit: { type: "number" },
    withinSuppliedAmountLimit: { type: "boolean" },
  },
  required: ["remainingLimit", "withinSuppliedAmountLimit"],
} as const;
/** Compare an explicit proposed amount with a supplied compatible currency limit without granting delegated authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { proposedAmount, suppliedAuthorityLimit } = request;
  const compute = (): Output => {
    H.domain(
      proposedAmount >= 0 && suppliedAuthorityLimit >= 0,
      "proposedAmount",
    );
    return {
      remainingLimit: suppliedAuthorityLimit - proposedAmount,
      withinSuppliedAmountLimit: proposedAmount <= suppliedAuthorityLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { proposedAmount: 800, suppliedAuthorityLimit: 1000 },
  output: { remainingLimit: 200, withinSuppliedAmountLimit: true },
} satisfies ToolExample<Input, Output>;
export const delegatedAuthorityCurrencyLimitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "public-administration",
        "public administration",
        "social sciences",
      ],
      keywords: ["public administration", "social sciences"],
    },
    id: "public-administration/delegated-authority-currency-limit-gap",
    title: "Delegated Authority Currency Limit Gap",
    description:
      "Compare an explicit proposed amount with a supplied compatible currency limit without granting delegated authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        proposedAmount: { type: "number", minimum: 0 },
        suppliedAuthorityLimit: { type: "number", minimum: 0 },
      },
      required: ["proposedAmount", "suppliedAuthorityLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingLimit: { type: "number" },
        withinSuppliedAmountLimit: { type: "boolean" },
      },
      required: ["remainingLimit", "withinSuppliedAmountLimit"],
    },
    ports: {
      inputs: [
        {
          id: "proposedAmount",
          label: "Proposed Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAuthorityLimit",
          label: "Supplied Authority Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingLimit",
          label: "Remaining Limit",
          valueType: { type: "number" },
        },
        {
          id: "withinSuppliedAmountLimit",
          label: "Within Supplied Amount Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = delegatedAuthorityCurrencyLimitGapTool.execute;
export default delegatedAuthorityCurrencyLimitGapTool;
