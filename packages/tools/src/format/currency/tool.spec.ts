import { describe, expect, it } from "vitest";
import {
  currencyFormatterExample,
  formatCurrency,
  runCurrencyFormatter,
} from "./tool.js";

describe("Currency Formatter", () => {
  it("formats a US dollar amount", () =>
    expect(formatCurrency(1234.56, "USD", "en-US")).toBe("$1,234.56"));
  it("rejects invalid currency codes and locales", () => {
    expect(formatCurrency(12, "US", "en-US")).toBeNull();
    expect(formatCurrency(12, "USD", "")).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runCurrencyFormatter(currencyFormatterExample.input)).toEqual({
      ok: true,
      output: currencyFormatterExample.output,
    }));
});
