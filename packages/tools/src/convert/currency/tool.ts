import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const currencyCode = /^[A-Z]{3}$/;

export const convertCurrencyAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rate: number,
): number | null => {
  if (
    !Number.isFinite(amount) ||
    !Number.isFinite(rate) ||
    rate <= 0 ||
    !currencyCode.test(fromCurrency) ||
    !currencyCode.test(toCurrency)
  )
    return null;
  const convertedAmount = amount * rate;
  return Number.isFinite(convertedAmount) ? convertedAmount : null;
};

export const currencyConversionExample = {
  input: { amount: 100, fromCurrency: "USD", rate: 0.85, toCurrency: "EUR" },
  output: { amount: 85, currency: "EUR" },
} satisfies ToolExample<
  {
    readonly amount: number;
    readonly fromCurrency: string;
    readonly rate: number;
    readonly toCurrency: string;
  },
  { readonly amount: number; readonly currency: string }
>;

export const currencyConversionTool = createSimpleTool({
  id: "convert/currency",
  title: "Currency Converter",
  description:
    "Convert a currency amount using a supplied positive exchange rate; applications may obtain current or historical rates from a data provider.",
  inputs: [
    { id: "amount", kind: "number", label: "Amount" },
    { id: "fromCurrency", kind: "string", label: "From currency" },
    { id: "toCurrency", kind: "string", label: "To currency" },
    { id: "rate", kind: "number", label: "Exchange rate", minimum: 0 },
  ],
  outputs: [
    { id: "amount", kind: "number", label: "Converted amount" },
    { id: "currency", kind: "string", label: "Currency" },
  ],
  calculate: (input) => {
    const amount = convertCurrencyAmount(
      input.amount as number,
      (input.fromCurrency as string).trim().toUpperCase(),
      (input.toCurrency as string).trim().toUpperCase(),
      input.rate as number,
    );
    if (amount === null)
      simpleError(
        "rate",
        "Enter valid currency codes and a positive finite rate.",
      );
    return {
      amount,
      currency: (input.toCurrency as string).trim().toUpperCase(),
    };
  },
});

export const runCurrencyConversion = currencyConversionTool.execute;
export default currencyConversionTool;
