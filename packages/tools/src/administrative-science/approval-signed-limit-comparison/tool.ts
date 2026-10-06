import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedAmount: number;
  readonly delegatedLimit: number;
  readonly approvalSigned: boolean;
};
export type Output = {
  readonly withinLimit: boolean;
  readonly signedAndWithinLimit: boolean;
  readonly excessAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedAmount: { type: "number", minimum: 0 },
    delegatedLimit: { type: "number", minimum: 0 },
    approvalSigned: { type: "boolean" },
  },
  required: ["signedAmount", "delegatedLimit", "approvalSigned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withinLimit: { type: "boolean" },
    signedAndWithinLimit: { type: "boolean" },
    excessAmount: { type: "number" },
  },
  required: ["withinLimit", "signedAndWithinLimit", "excessAmount"],
} as const;
/** Compare a recorded signed approval with an explicit inclusive delegated amount limit without granting authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedAmount, delegatedLimit, approvalSigned } = request;
  const compute = (): Output => {
    H.domain(signedAmount >= 0 && delegatedLimit >= 0, "signedAmount");
    return {
      withinLimit: signedAmount <= delegatedLimit,
      signedAndWithinLimit: approvalSigned && signedAmount <= delegatedLimit,
      excessAmount: Math.max(0, signedAmount - delegatedLimit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedAmount: 800, delegatedLimit: 1000, approvalSigned: true },
  output: { withinLimit: true, signedAndWithinLimit: true, excessAmount: 0 },
} satisfies ToolExample<Input, Output>;
export const approvalSignedLimitComparisonTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/approval-signed-limit-comparison",
    title: "Approval Signed Limit Comparison",
    description:
      "Compare a recorded signed approval with an explicit inclusive delegated amount limit without granting authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedAmount: { type: "number", minimum: 0 },
        delegatedLimit: { type: "number", minimum: 0 },
        approvalSigned: { type: "boolean" },
      },
      required: ["signedAmount", "delegatedLimit", "approvalSigned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withinLimit: { type: "boolean" },
        signedAndWithinLimit: { type: "boolean" },
        excessAmount: { type: "number" },
      },
      required: ["withinLimit", "signedAndWithinLimit", "excessAmount"],
    },
    ports: {
      inputs: [
        {
          id: "signedAmount",
          label: "Signed Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delegatedLimit",
          label: "Delegated Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "approvalSigned",
          label: "Approval Signed",
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
        {
          id: "signedAndWithinLimit",
          label: "Signed And Within Limit",
          valueType: { type: "boolean" },
        },
        {
          id: "excessAmount",
          label: "Excess Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = approvalSignedLimitComparisonTool.execute;
export default approvalSignedLimitComparisonTool;
