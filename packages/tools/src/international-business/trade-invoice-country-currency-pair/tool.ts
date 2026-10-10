import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoiceId: string;
  readonly countryCode: string;
  readonly currencyCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoiceId: { type: "string", maxLength: 8192, minLength: 1 },
    countryCode: { type: "string", maxLength: 8192, minLength: 1 },
    currencyCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["invoiceId", "countryCode", "currencyCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit invoice country and currency codes without registry lookup or tax classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invoiceId, countryCode, currencyCode } = request;
  const compute = (): Output => {
    H.domain(invoiceId.length > 0, "invoiceId");
    H.domain(countryCode.length > 0, "countryCode");
    H.domain(currencyCode.length > 0, "currencyCode");
    return { token: JSON.stringify([invoiceId, countryCode, currencyCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { invoiceId: "INV17", countryCode: "AA", currencyCode: "USD" },
  output: { token: '["INV17","AA","USD"]' },
} satisfies ToolExample<Input, Output>;
export const tradeInvoiceCountryCurrencyPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-business",
        "international business",
        "business and finance",
      ],
      keywords: ["international business", "business and finance"],
    },
    id: "international-business/trade-invoice-country-currency-pair",
    title: "Trade Invoice Country Currency Pair",
    description:
      "Record explicit invoice country and currency codes without registry lookup or tax classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invoiceId: { type: "string", maxLength: 8192, minLength: 1 },
        countryCode: { type: "string", maxLength: 8192, minLength: 1 },
        currencyCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["invoiceId", "countryCode", "currencyCode"],
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
          id: "invoiceId",
          label: "Invoice Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "countryCode",
          label: "Country Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currencyCode",
          label: "Currency Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = tradeInvoiceCountryCurrencyPairTool.execute;
export default tradeInvoiceCountryCurrencyPairTool;
