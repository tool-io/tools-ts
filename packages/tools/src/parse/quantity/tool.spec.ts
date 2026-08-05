import { describe, expect, it } from "vitest";
import {
  parseQuantity,
  quantityParserExample,
  runQuantityParser,
} from "./tool.js";

describe("Quantity with Unit Parser", () => {
  it("parses a value and unit", () =>
    expect(parseQuantity("12.5 kg")).toEqual({ unit: "kg", value: 12.5 }));
  it("supports localized numbers", () =>
    expect(parseQuantity("1.234,5 kg", "de-DE")?.value).toBe(1234.5));
  it("rejects a quantity without a unit", () =>
    expect(parseQuantity("12.5")).toBeNull());
  it("publishes an executable example", () =>
    expect(runQuantityParser(quantityParserExample.input)).toEqual({
      ok: true,
      output: quantityParserExample.output,
    }));
});
