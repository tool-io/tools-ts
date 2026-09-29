import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documents: number;
  readonly discrepancies: number;
  readonly feePerDiscrepancy: number;
  readonly minimumFee: number;
  readonly maximumFee: number;
};
export type Output = {
  readonly uncappedFee: number;
  readonly chargedFee: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documents: { type: "integer", minimum: 0 },
    discrepancies: { type: "integer", minimum: 0 },
    feePerDiscrepancy: { type: "number", minimum: 0 },
    minimumFee: { type: "number", minimum: 0 },
    maximumFee: { type: "number" },
  },
  required: [
    "documents",
    "discrepancies",
    "feePerDiscrepancy",
    "minimumFee",
    "maximumFee",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncappedFee: { type: "number" },
    chargedFee: { type: "number" },
  },
  required: ["uncappedFee", "chargedFee"],
} as const;
/** Explicit per-document-discrepancy tariff with minimum and maximum fees; no bank tariff is looked up. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    documents,
    discrepancies,
    feePerDiscrepancy,
    minimumFee,
    maximumFee,
  } = request;
  const compute = (): Output => {
    H.integer(documents, 0);
    H.integer(discrepancies, 0, documents);
    H.domain(
      feePerDiscrepancy >= 0 && minimumFee >= 0 && maximumFee >= minimumFee,
    );
    return {
      uncappedFee: discrepancies * feePerDiscrepancy,
      chargedFee:
        discrepancies === 0
          ? 0
          : Math.max(
              minimumFee,
              Math.min(maximumFee, discrepancies * feePerDiscrepancy),
            ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    documents: 10,
    discrepancies: 3,
    feePerDiscrepancy: 20,
    minimumFee: 30,
    maximumFee: 100,
  },
  output: { uncappedFee: 60, chargedFee: 60 },
} satisfies ToolExample<Input, Output>;
export const tradeFinanceDocumentDiscrepancyFeeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/trade-finance-document-discrepancy-fee-term",
      title: "Trade Finance Document Discrepancy Fee Term Tool",
      description:
        "Explicit per-document-discrepancy tariff with minimum and maximum fees; no bank tariff is looked up.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          documents: { type: "integer", minimum: 0 },
          discrepancies: { type: "integer", minimum: 0 },
          feePerDiscrepancy: { type: "number", minimum: 0 },
          minimumFee: { type: "number", minimum: 0 },
          maximumFee: { type: "number" },
        },
        required: [
          "documents",
          "discrepancies",
          "feePerDiscrepancy",
          "minimumFee",
          "maximumFee",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uncappedFee: { type: "number" },
          chargedFee: { type: "number" },
        },
        required: ["uncappedFee", "chargedFee"],
      },
      ports: {
        inputs: [
          {
            id: "documents",
            label: "Documents",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "discrepancies",
            label: "Discrepancies",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "feePerDiscrepancy",
            label: "Fee Per Discrepancy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimumFee",
            label: "Minimum Fee",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximumFee",
            label: "Maximum Fee",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "uncappedFee",
            label: "Uncapped Fee",
            valueType: { type: "number" },
          },
          {
            id: "chargedFee",
            label: "Charged Fee",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tradeFinanceDocumentDiscrepancyFeeTermTool.execute;
export default tradeFinanceDocumentDiscrepancyFeeTermTool;
