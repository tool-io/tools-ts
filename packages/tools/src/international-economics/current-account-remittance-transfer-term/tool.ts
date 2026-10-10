import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly remittanceReceipts: number;
  readonly remittancePayments: number;
};
export type Output = { readonly netRemittanceTransfer: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remittanceReceipts: { type: "number", minimum: 0 },
    remittancePayments: { type: "number", minimum: 0 },
  },
  required: ["remittanceReceipts", "remittancePayments"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netRemittanceTransfer: { type: "number" } },
  required: ["netRemittanceTransfer"],
} as const;
/** Calculate supplied remittance receipts minus payments on one balance-of-payments reporting basis without classifying transactions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { remittanceReceipts, remittancePayments } = request;
  const compute = (): Output => {
    H.domain(remittanceReceipts >= 0, "remittanceReceipts");
    H.domain(remittancePayments >= 0, "remittancePayments");
    return { netRemittanceTransfer: remittanceReceipts - remittancePayments };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { remittanceReceipts: 120, remittancePayments: 40 },
  output: { netRemittanceTransfer: 80 },
} satisfies ToolExample<Input, Output>;
export const currentAccountRemittanceTransferTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-economics/current-account-remittance-transfer-term",
      title: "Current Account Remittance Transfer Term Tool",
      description:
        "Calculate supplied remittance receipts minus payments on one balance-of-payments reporting basis without classifying transactions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remittanceReceipts: { type: "number", minimum: 0 },
          remittancePayments: { type: "number", minimum: 0 },
        },
        required: ["remittanceReceipts", "remittancePayments"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { netRemittanceTransfer: { type: "number" } },
        required: ["netRemittanceTransfer"],
      },
      ports: {
        inputs: [
          {
            id: "remittanceReceipts",
            label: "Remittance Receipts",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "remittancePayments",
            label: "Remittance Payments",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netRemittanceTransfer",
            label: "Net Remittance Transfer",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = currentAccountRemittanceTransferTermTool.execute;
export default currentAccountRemittanceTransferTermTool;
