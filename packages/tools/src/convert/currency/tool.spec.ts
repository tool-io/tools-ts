import { describe, expect, it } from "vitest";
import {
  convertCurrencyAmount,
  currencyConversionExample,
  runCurrencyConversion,
} from "./tool.js";

describe("Currency Converter", () => {
  it("converts using a supplied exchange rate", () =>
    expect(convertCurrencyAmount(100, "USD", "EUR", 0.85)).toBe(85));
  it("supports negative amounts", () =>
    expect(convertCurrencyAmount(-50, "USD", "EUR", 0.8)).toBe(-40));
  it("rejects invalid codes and rates", () => {
    expect(convertCurrencyAmount(1, "US", "EUR", 1)).toBeNull();
    expect(convertCurrencyAmount(1, "USD", "EUR", 0)).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runCurrencyConversion(currencyConversionExample.input)).toEqual({
      ok: true,
      output: currencyConversionExample.output,
    }));
});
