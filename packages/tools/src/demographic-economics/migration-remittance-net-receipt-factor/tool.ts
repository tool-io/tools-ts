import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sent: number;
  readonly exchangeRate: number;
  readonly senderFee: number;
  readonly receiverFee: number;
  readonly percentFee: number;
};
export type Output = {
  readonly grossConverted: number;
  readonly netReceived: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sent: { type: "number" },
    exchangeRate: { type: "number", exclusiveMinimum: 0 },
    senderFee: { type: "number", minimum: 0 },
    receiverFee: { type: "number", minimum: 0 },
    percentFee: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["sent", "exchangeRate", "senderFee", "receiverFee", "percentFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossConverted: { type: "number" },
    netReceived: { type: "number" },
  },
  required: ["grossConverted", "netReceived"],
} as const;
/** Sender fee is deducted before conversion, proportional fee after conversion, then receiver fee; all conventions are explicit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sent, exchangeRate, senderFee, receiverFee, percentFee } = request;
  const compute = (): Output => {
    H.domain(senderFee >= 0 && sent >= senderFee && receiverFee >= 0);
    H.positive(exchangeRate);
    H.probability(percentFee);
    return {
      grossConverted: (sent - senderFee) * exchangeRate,
      netReceived:
        (sent - senderFee) * exchangeRate * (1 - percentFee) - receiverFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sent: 1000,
    exchangeRate: 2,
    senderFee: 10,
    receiverFee: 5,
    percentFee: 0.1,
  },
  output: { grossConverted: 1980, netReceived: 1777 },
} satisfies ToolExample<Input, Output>;
export const migrationRemittanceNetReceiptFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/migration-remittance-net-receipt-factor",
      title: "Migration Remittance Net Receipt Factor Tool",
      description:
        "Sender fee is deducted before conversion, proportional fee after conversion, then receiver fee; all conventions are explicit.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sent: { type: "number" },
          exchangeRate: { type: "number", exclusiveMinimum: 0 },
          senderFee: { type: "number", minimum: 0 },
          receiverFee: { type: "number", minimum: 0 },
          percentFee: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "sent",
          "exchangeRate",
          "senderFee",
          "receiverFee",
          "percentFee",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossConverted: { type: "number" },
          netReceived: { type: "number" },
        },
        required: ["grossConverted", "netReceived"],
      },
      ports: {
        inputs: [
          {
            id: "sent",
            label: "Sent",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exchangeRate",
            label: "Exchange Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "senderFee",
            label: "Sender Fee",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "receiverFee",
            label: "Receiver Fee",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "percentFee",
            label: "Percent Fee",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "grossConverted",
            label: "Gross Converted",
            valueType: { type: "number" },
          },
          {
            id: "netReceived",
            label: "Net Received",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = migrationRemittanceNetReceiptFactorTool.execute;
export default migrationRemittanceNetReceiptFactorTool;
