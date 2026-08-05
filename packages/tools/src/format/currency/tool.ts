import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const currencyCode = /^[A-Z]{3}$/;
export const formatCurrency = (
  amount: number,
  currency: string,
  locale: string,
): string | null => {
  const code = currency.trim().toUpperCase();
  if (!Number.isFinite(amount) || !currencyCode.test(code) || !locale.trim())
    return null;
  try {
    return new Intl.NumberFormat(locale, {
      currency: code,
      style: "currency",
    }).format(amount);
  } catch {
    return null;
  }
};

export const currencyFormatterExample = {
  input: { amount: 1234.56, currency: "USD", locale: "en-US" },
  output: { text: "$1,234.56" },
} satisfies ToolExample<
  {
    readonly amount: number;
    readonly currency: string;
    readonly locale: string;
  },
  { readonly text: string }
>;

export const currencyFormatterTool = createSimpleTool({
  id: "format/currency",
  title: "Currency Formatter",
  description:
    "Format a finite amount using an explicit currency code and locale.",
  inputs: [
    { id: "amount", kind: "number", label: "Amount" },
    { id: "currency", kind: "string", label: "Currency" },
    { id: "locale", kind: "string", label: "Locale" },
  ],
  outputs: [
    {
      format: "currency",
      id: "text",
      kind: "string",
      label: "Formatted currency",
    },
  ],
  calculate: (input) => {
    const text = formatCurrency(
      input.amount as number,
      input.currency as string,
      input.locale as string,
    );
    if (text === null)
      simpleError("currency", "Enter a supported currency code and locale.");
    return { text };
  },
});

export const runCurrencyFormatter = currencyFormatterTool.execute;
export default currencyFormatterTool;
