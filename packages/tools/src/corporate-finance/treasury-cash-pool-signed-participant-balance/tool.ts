import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantCodes: readonly string[];
  readonly balances: readonly number[];
};
export type Output = {
  readonly netPoolBalance: number;
  readonly positiveBalances: number;
  readonly negativeBalanceMagnitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    balances: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["participantCodes", "balances"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netPoolBalance: { type: "number" },
    positiveBalances: { type: "number" },
    negativeBalanceMagnitude: { type: "number" },
  },
  required: ["netPoolBalance", "positiveBalances", "negativeBalanceMagnitude"],
} as const;
/** Aggregate explicitly signed participant cash-pool balances into net, positive and negative-magnitude totals without determining legal netting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantCodes, balances } = request;
  const compute = (): Output => {
    H.domain(participantCodes.length === balances.length, "balances");
    H.domain(
      new Set(participantCodes).size === participantCodes.length,
      "participantCodes",
    );
    return {
      netPoolBalance: balances.reduce((a, b) => a + b, 0),
      positiveBalances: balances.reduce((a, b) => a + Math.max(0, b), 0),
      negativeBalanceMagnitude: balances.reduce(
        (a, b) => a + Math.max(0, -b),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { participantCodes: ["A", "B", "C"], balances: [100, -40, 20] },
  output: {
    netPoolBalance: 80,
    positiveBalances: 120,
    negativeBalanceMagnitude: 40,
  },
} satisfies ToolExample<Input, Output>;
export const treasuryCashPoolSignedParticipantBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "trading"],
        fields: [
          "corporate-finance",
          "corporate finance",
          "business and finance",
        ],
        keywords: ["corporate finance", "business and finance"],
      },
      id: "corporate-finance/treasury-cash-pool-signed-participant-balance",
      title: "Treasury Cash Pool Signed Participant Balance",
      description:
        "Aggregate explicitly signed participant cash-pool balances into net, positive and negative-magnitude totals without determining legal netting.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          participantCodes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          balances: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["participantCodes", "balances"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netPoolBalance: { type: "number" },
          positiveBalances: { type: "number" },
          negativeBalanceMagnitude: { type: "number" },
        },
        required: [
          "netPoolBalance",
          "positiveBalances",
          "negativeBalanceMagnitude",
        ],
      },
      ports: {
        inputs: [
          {
            id: "participantCodes",
            label: "Participant Codes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "balances",
            label: "Balances",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "netPoolBalance",
            label: "Net Pool Balance",
            valueType: { type: "number" },
          },
          {
            id: "positiveBalances",
            label: "Positive Balances",
            valueType: { type: "number" },
          },
          {
            id: "negativeBalanceMagnitude",
            label: "Negative Balance Magnitude",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = treasuryCashPoolSignedParticipantBalanceTool.execute;
export default treasuryCashPoolSignedParticipantBalanceTool;
