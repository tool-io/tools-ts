import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  numberFormats,
  parseNumber,
  type NumberFormat,
} from "../number/tool.js";

export type CurrencyAmount = {
  readonly amount: number;
  readonly currency: string;
};
const currencyCode = /^[A-Z]{3}$/;
const symbols: Readonly<Record<string, readonly string[]>> = {
  AUD: ["A$", "$"],
  CAD: ["C$", "$"],
  CHF: ["CHF"],
  CNY: ["CN¥", "¥", "￥"],
  EUR: ["€"],
  GBP: ["£"],
  HKD: ["HK$", "$"],
  INR: ["₹"],
  JPY: ["JP¥", "¥", "￥"],
  KRW: ["₩"],
  NZD: ["NZ$", "$"],
  SGD: ["S$", "$"],
  USD: ["US$", "$"],
};

export const parseCurrency = (
  input: string,
  currencyInput: string,
  format: NumberFormat = "plain",
): CurrencyAmount | null => {
  const currency = currencyInput.trim().toUpperCase();
  if (!currencyCode.test(currency)) return null;
  let text = input.trim();
  const uppercase = text.toUpperCase();
  if (uppercase.startsWith(currency)) text = text.slice(currency.length).trim();
  else if (uppercase.endsWith(currency))
    text = text.slice(0, -currency.length).trim();
  for (const symbol of symbols[currency] ?? []) {
    if (text.startsWith(symbol)) text = text.slice(symbol.length).trim();
    else if (text.endsWith(symbol)) text = text.slice(0, -symbol.length).trim();
  }
  const amount = parseNumber(text, format);
  return amount === null ? null : { amount, currency };
};

export const currencyParserExample = {
  input: { currency: "USD", format: "en-US", text: "$1,234.56" },
  output: { amount: 1234.56, currency: "USD" },
} satisfies ToolExample<
  {
    readonly currency: string;
    readonly format: NumberFormat;
    readonly text: string;
  },
  CurrencyAmount
>;

export const currencyParserTool = createSimpleTool({
  id: "parse/currency",
  title: "Currency Parser",
  description:
    "Parse a currency amount using an explicit currency code and number format.",
  inputs: [
    { id: "text", kind: "string", label: "Currency text" },
    { id: "currency", kind: "string", label: "Currency" },
    {
      enum: numberFormats,
      id: "format",
      kind: "string",
      label: "Number format",
    },
  ],
  outputs: [
    { id: "amount", kind: "number", label: "Amount" },
    { id: "currency", kind: "string", label: "Currency" },
  ],
  calculate: (input) => {
    const result = parseCurrency(
      input.text as string,
      input.currency as string,
      input.format as NumberFormat,
    );
    if (!result) simpleError("text", "Enter a valid currency amount.");
    return result;
  },
});

export const runCurrencyParser = currencyParserTool.execute;
export default currencyParserTool;
