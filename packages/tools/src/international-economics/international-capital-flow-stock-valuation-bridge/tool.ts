import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingPosition: number;
  readonly financialTransactions: number;
  readonly priceValuation: number;
  readonly fxValuation: number;
  readonly otherAdjustments: number;
};
export type Output = {
  readonly closingPosition: number;
  readonly nontransactionChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingPosition: { type: "number" },
    financialTransactions: { type: "number" },
    priceValuation: { type: "number" },
    fxValuation: { type: "number" },
    otherAdjustments: { type: "number" },
  },
  required: [
    "openingPosition",
    "financialTransactions",
    "priceValuation",
    "fxValuation",
    "otherAdjustments",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closingPosition: { type: "number" },
    nontransactionChange: { type: "number" },
  },
  required: ["closingPosition", "nontransactionChange"],
} as const;
/** Signed external asset or liability position reconciliation, using one caller-consistent stock and transaction sign convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    openingPosition,
    financialTransactions,
    priceValuation,
    fxValuation,
    otherAdjustments,
  } = request;
  const compute = (): Output => {
    return {
      closingPosition:
        openingPosition +
        financialTransactions +
        priceValuation +
        fxValuation +
        otherAdjustments,
      nontransactionChange: priceValuation + fxValuation + otherAdjustments,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingPosition: 1000,
    financialTransactions: 100,
    priceValuation: 20,
    fxValuation: -30,
    otherAdjustments: 5,
  },
  output: { closingPosition: 1095, nontransactionChange: -5 },
} satisfies ToolExample<Input, Output>;
export const internationalCapitalFlowStockValuationBridgeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-economics/international-capital-flow-stock-valuation-bridge",
      title: "International Capital Flow Stock Valuation Bridge Tool",
      description:
        "Signed external asset or liability position reconciliation, using one caller-consistent stock and transaction sign convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingPosition: { type: "number" },
          financialTransactions: { type: "number" },
          priceValuation: { type: "number" },
          fxValuation: { type: "number" },
          otherAdjustments: { type: "number" },
        },
        required: [
          "openingPosition",
          "financialTransactions",
          "priceValuation",
          "fxValuation",
          "otherAdjustments",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          closingPosition: { type: "number" },
          nontransactionChange: { type: "number" },
        },
        required: ["closingPosition", "nontransactionChange"],
      },
      ports: {
        inputs: [
          {
            id: "openingPosition",
            label: "Opening Position",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "financialTransactions",
            label: "Financial Transactions",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "priceValuation",
            label: "Price Valuation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fxValuation",
            label: "Fx Valuation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "otherAdjustments",
            label: "Other Adjustments",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "closingPosition",
            label: "Closing Position",
            valueType: { type: "number" },
          },
          {
            id: "nontransactionChange",
            label: "Nontransaction Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = internationalCapitalFlowStockValuationBridgeTool.execute;
export default internationalCapitalFlowStockValuationBridgeTool;
