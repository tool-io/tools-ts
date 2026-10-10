import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly quoteUnitsPerBaseUnit: number };
export type Output = { readonly baseUnitsPerQuoteUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quoteUnitsPerBaseUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["quoteUnitsPerBaseUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { baseUnitsPerQuoteUnit: { type: "number" } },
  required: ["baseUnitsPerQuoteUnit"],
} as const;
/** Invert an explicitly supplied positive bilateral exchange-rate quotation without fetching market rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quoteUnitsPerBaseUnit } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(quoteUnitsPerBaseUnit) && quoteUnitsPerBaseUnit > 0,
      "quoteUnitsPerBaseUnit",
    ),
      quoteUnitsPerBaseUnit);
    return { baseUnitsPerQuoteUnit: 1 / quoteUnitsPerBaseUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quoteUnitsPerBaseUnit: 1.25 },
  output: { baseUnitsPerQuoteUnit: 0.8 },
} satisfies ToolExample<Input, Output>;
export const bilateralExchangeRateQuotationInversionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-economics/bilateral-exchange-rate-quotation-inversion",
      title: "Bilateral Exchange Rate Quotation Inversion Tool",
      description:
        "Invert an explicitly supplied positive bilateral exchange-rate quotation without fetching market rates.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          quoteUnitsPerBaseUnit: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["quoteUnitsPerBaseUnit"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { baseUnitsPerQuoteUnit: { type: "number" } },
        required: ["baseUnitsPerQuoteUnit"],
      },
      ports: {
        inputs: [
          {
            id: "quoteUnitsPerBaseUnit",
            label: "Quote Units Per Base Unit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "baseUnitsPerQuoteUnit",
            label: "Base Units Per Quote Unit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = bilateralExchangeRateQuotationInversionTool.execute;
export default bilateralExchangeRateQuotationInversionTool;
