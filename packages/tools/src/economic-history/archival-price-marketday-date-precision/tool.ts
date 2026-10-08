import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priceRecordId: string;
  readonly suppliedDateText: string;
  readonly datePrecision: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDateText: { type: "string", maxLength: 8192, minLength: 1 },
    datePrecision: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["priceRecordId", "suppliedDateText", "datePrecision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied archival market-price date and precision without reconstructing market days. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priceRecordId, suppliedDateText, datePrecision } = request;
  const compute = (): Output => {
    H.domain(priceRecordId.length > 0, "priceRecordId");
    H.domain(suppliedDateText.length > 0, "suppliedDateText");
    H.domain(datePrecision.length > 0, "datePrecision");
    return {
      token: JSON.stringify([priceRecordId, suppliedDateText, datePrecision]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    priceRecordId: "P17",
    suppliedDateText: "circa 1900",
    datePrecision: "year approximate",
  },
  output: { token: '["P17","circa 1900","year approximate"]' },
} satisfies ToolExample<Input, Output>;
export const archivalPriceMarketdayDatePrecisionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economic-history/archival-price-marketday-date-precision",
      title: "Archival Price Marketday Date Precision Tool",
      description:
        "Preserve a supplied archival market-price date and precision without reconstructing market days.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          priceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedDateText: { type: "string", maxLength: 8192, minLength: 1 },
          datePrecision: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["priceRecordId", "suppliedDateText", "datePrecision"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "priceRecordId",
            label: "Price Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedDateText",
            label: "Supplied Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "datePrecision",
            label: "Date Precision",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = archivalPriceMarketdayDatePrecisionTool.execute;
export default archivalPriceMarketdayDatePrecisionTool;
