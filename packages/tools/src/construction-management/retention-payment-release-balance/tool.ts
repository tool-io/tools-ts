import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retentionHeld: number;
  readonly releasedAmount: number;
  readonly additionalRetention: number;
};
export type Output = { readonly closingRetention: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retentionHeld: { type: "number", minimum: 0 },
    releasedAmount: { type: "number", minimum: 0 },
    additionalRetention: { type: "number", minimum: 0 },
  },
  required: ["retentionHeld", "releasedAmount", "additionalRetention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingRetention: { type: "number" } },
  required: ["closingRetention"],
} as const;
/** Balance recorded construction retention held, additions and releases without choosing contract release conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retentionHeld, releasedAmount, additionalRetention } = request;
  const compute = (): Output => {
    H.domain(
      retentionHeld >= 0 &&
        releasedAmount >= 0 &&
        additionalRetention >= 0 &&
        releasedAmount <= retentionHeld + additionalRetention,
      "retentionHeld",
    );
    return {
      closingRetention: retentionHeld + additionalRetention - releasedAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    retentionHeld: 10000,
    releasedAmount: 3000,
    additionalRetention: 500,
  },
  output: { closingRetention: 7500 },
} satisfies ToolExample<Input, Output>;
export const retentionPaymentReleaseBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/retention-payment-release-balance",
    title: "Retention Payment Release Balance",
    description:
      "Balance recorded construction retention held, additions and releases without choosing contract release conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retentionHeld: { type: "number", minimum: 0 },
        releasedAmount: { type: "number", minimum: 0 },
        additionalRetention: { type: "number", minimum: 0 },
      },
      required: ["retentionHeld", "releasedAmount", "additionalRetention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingRetention: { type: "number" } },
      required: ["closingRetention"],
    },
    ports: {
      inputs: [
        {
          id: "retentionHeld",
          label: "Retention Held",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "releasedAmount",
          label: "Released Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "additionalRetention",
          label: "Additional Retention",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingRetention",
          label: "Closing Retention",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = retentionPaymentReleaseBalanceTool.execute;
export default retentionPaymentReleaseBalanceTool;
