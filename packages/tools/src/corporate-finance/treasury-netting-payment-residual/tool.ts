import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly payables: number; readonly receivables: number };
export type Output = { readonly signedNetPayable: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payables: { type: "number", minimum: 0 },
    receivables: { type: "number", minimum: 0 },
  },
  required: ["payables", "receivables"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedNetPayable: { type: "number" } },
  required: ["signedNetPayable"],
} as const;
/** Subtract supplied receivables from payables on one currency and settlement basis without asserting netting enforceability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payables, receivables } = request;
  const compute = (): Output => {
    H.domain(payables >= 0, "payables");
    H.domain(receivables >= 0, "receivables");
    return { signedNetPayable: payables - receivables };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { payables: 100, receivables: 75 },
  output: { signedNetPayable: 25 },
} satisfies ToolExample<Input, Output>;
export const treasuryNettingPaymentResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
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
    id: "corporate-finance/treasury-netting-payment-residual",
    title: "Treasury Netting Payment Residual",
    description:
      "Subtract supplied receivables from payables on one currency and settlement basis without asserting netting enforceability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        payables: { type: "number", minimum: 0 },
        receivables: { type: "number", minimum: 0 },
      },
      required: ["payables", "receivables"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedNetPayable: { type: "number" } },
      required: ["signedNetPayable"],
    },
    ports: {
      inputs: [
        {
          id: "payables",
          label: "Payables",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivables",
          label: "Receivables",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedNetPayable",
          label: "Signed Net Payable",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treasuryNettingPaymentResidualTool.execute;
export default treasuryNettingPaymentResidualTool;
