import { describe, expect, it } from "vitest";
import {
  currencyParserExample,
  parseCurrency,
  runCurrencyParser,
} from "./tool.js";

describe("Currency Parser", () => {
  it("parses currency symbols and codes", () => {
    expect(parseCurrency("$1,234.56", "USD", "en-US")).toEqual({
      amount: 1234.56,
      currency: "USD",
    });
    expect(parseCurrency("1.234,56 EUR", "EUR", "de-DE")).toEqual({
      amount: 1234.56,
      currency: "EUR",
    });
  });
  it("rejects invalid currency codes", () =>
    expect(parseCurrency("12", "US")).toBeNull());
  it("publishes an executable example", () =>
    expect(runCurrencyParser(currencyParserExample.input)).toEqual({
      ok: true,
      output: currencyParserExample.output,
    }));
});
