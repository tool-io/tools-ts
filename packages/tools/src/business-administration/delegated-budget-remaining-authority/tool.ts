import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly delegatedAmount: number;
  readonly alreadyApprovedAmount: number;
  readonly pendingRequestAmount: number;
};
export type Output = {
  readonly remainingAuthority: number;
  readonly requestWithinRemaining: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delegatedAmount: { type: "number", minimum: 0 },
    alreadyApprovedAmount: { type: "number", minimum: 0 },
    pendingRequestAmount: { type: "number", minimum: 0 },
  },
  required: [
    "delegatedAmount",
    "alreadyApprovedAmount",
    "pendingRequestAmount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingAuthority: { type: "number" },
    requestWithinRemaining: { type: "boolean" },
  },
  required: ["remainingAuthority", "requestWithinRemaining"],
} as const;
/** Compare a pending approval amount with explicitly unconsumed delegated budget authority without approving the request. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delegatedAmount, alreadyApprovedAmount, pendingRequestAmount } =
    request;
  const compute = (): Output => {
    H.domain(
      delegatedAmount >= 0 &&
        alreadyApprovedAmount >= 0 &&
        alreadyApprovedAmount <= delegatedAmount &&
        pendingRequestAmount >= 0,
      "delegatedAmount",
    );
    return {
      remainingAuthority: delegatedAmount - alreadyApprovedAmount,
      requestWithinRemaining:
        pendingRequestAmount <= delegatedAmount - alreadyApprovedAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    delegatedAmount: 10000,
    alreadyApprovedAmount: 7000,
    pendingRequestAmount: 2500,
  },
  output: { remainingAuthority: 3000, requestWithinRemaining: true },
} satisfies ToolExample<Input, Output>;
export const delegatedBudgetRemainingAuthorityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/delegated-budget-remaining-authority",
    title: "Delegated Budget Remaining Authority",
    description:
      "Compare a pending approval amount with explicitly unconsumed delegated budget authority without approving the request.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delegatedAmount: { type: "number", minimum: 0 },
        alreadyApprovedAmount: { type: "number", minimum: 0 },
        pendingRequestAmount: { type: "number", minimum: 0 },
      },
      required: [
        "delegatedAmount",
        "alreadyApprovedAmount",
        "pendingRequestAmount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingAuthority: { type: "number" },
        requestWithinRemaining: { type: "boolean" },
      },
      required: ["remainingAuthority", "requestWithinRemaining"],
    },
    ports: {
      inputs: [
        {
          id: "delegatedAmount",
          label: "Delegated Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alreadyApprovedAmount",
          label: "Already Approved Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pendingRequestAmount",
          label: "Pending Request Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingAuthority",
          label: "Remaining Authority",
          valueType: { type: "number" },
        },
        {
          id: "requestWithinRemaining",
          label: "Request Within Remaining",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = delegatedBudgetRemainingAuthorityTool.execute;
export default delegatedBudgetRemainingAuthorityTool;
