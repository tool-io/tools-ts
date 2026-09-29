import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly foreignPrincipal: number;
  readonly oldDomesticPerForeign: number;
  readonly newDomesticPerForeign: number;
  readonly foreignPrincipalChange: number;
};
export type Output = {
  readonly openingDomestic: number;
  readonly closingDomestic: number;
  readonly valuationOnOpening: number;
  readonly transactionAtNewRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foreignPrincipal: { type: "number", minimum: 0 },
    oldDomesticPerForeign: { type: "number", exclusiveMinimum: 0 },
    newDomesticPerForeign: { type: "number", exclusiveMinimum: 0 },
    foreignPrincipalChange: { type: "number" },
  },
  required: [
    "foreignPrincipal",
    "oldDomesticPerForeign",
    "newDomesticPerForeign",
    "foreignPrincipalChange",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingDomestic: { type: "number" },
    closingDomestic: { type: "number" },
    valuationOnOpening: { type: "number" },
    transactionAtNewRate: { type: "number" },
  },
  required: [
    "openingDomestic",
    "closingDomestic",
    "valuationOnOpening",
    "transactionAtNewRate",
  ],
} as const;
/** Opening-stock FX valuation plus transactions at the new rate; no maturity, interest accrual or hedging model is included. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    foreignPrincipal,
    oldDomesticPerForeign,
    newDomesticPerForeign,
    foreignPrincipalChange,
  } = request;
  const compute = (): Output => {
    H.domain(
      foreignPrincipal >= 0 && foreignPrincipal + foreignPrincipalChange >= 0,
    );
    H.positive(oldDomesticPerForeign);
    H.positive(newDomesticPerForeign);
    return {
      openingDomestic: foreignPrincipal * oldDomesticPerForeign,
      closingDomestic:
        (foreignPrincipal + foreignPrincipalChange) * newDomesticPerForeign,
      valuationOnOpening:
        foreignPrincipal * (newDomesticPerForeign - oldDomesticPerForeign),
      transactionAtNewRate: foreignPrincipalChange * newDomesticPerForeign,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    foreignPrincipal: 100,
    oldDomesticPerForeign: 2,
    newDomesticPerForeign: 2.2,
    foreignPrincipalChange: 10,
  },
  output: {
    openingDomestic: 200,
    closingDomestic: 242.00000000000003,
    valuationOnOpening: 20.000000000000018,
    transactionAtNewRate: 22,
  },
} satisfies ToolExample<Input, Output>;
export const externalDebtCurrencyValuationOneTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-economics/external-debt-currency-valuation-one-term",
      title: "External Debt Currency Valuation One Term Tool",
      description:
        "Opening-stock FX valuation plus transactions at the new rate; no maturity, interest accrual or hedging model is included.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          foreignPrincipal: { type: "number", minimum: 0 },
          oldDomesticPerForeign: { type: "number", exclusiveMinimum: 0 },
          newDomesticPerForeign: { type: "number", exclusiveMinimum: 0 },
          foreignPrincipalChange: { type: "number" },
        },
        required: [
          "foreignPrincipal",
          "oldDomesticPerForeign",
          "newDomesticPerForeign",
          "foreignPrincipalChange",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingDomestic: { type: "number" },
          closingDomestic: { type: "number" },
          valuationOnOpening: { type: "number" },
          transactionAtNewRate: { type: "number" },
        },
        required: [
          "openingDomestic",
          "closingDomestic",
          "valuationOnOpening",
          "transactionAtNewRate",
        ],
      },
      ports: {
        inputs: [
          {
            id: "foreignPrincipal",
            label: "Foreign Principal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldDomesticPerForeign",
            label: "Old Domestic Per Foreign",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newDomesticPerForeign",
            label: "New Domestic Per Foreign",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "foreignPrincipalChange",
            label: "Foreign Principal Change",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "openingDomestic",
            label: "Opening Domestic",
            valueType: { type: "number" },
          },
          {
            id: "closingDomestic",
            label: "Closing Domestic",
            valueType: { type: "number" },
          },
          {
            id: "valuationOnOpening",
            label: "Valuation On Opening",
            valueType: { type: "number" },
          },
          {
            id: "transactionAtNewRate",
            label: "Transaction At New Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = externalDebtCurrencyValuationOneTermTool.execute;
export default externalDebtCurrencyValuationOneTermTool;
