import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, currencySymbolStripToNumberInputSchema, currencySymbolStripToNumberOutputSchema } from "./index.js";
describe("csv/currency-symbol-strip-to-number", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, currencySymbolStripToNumberInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, currencySymbolStripToNumberOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "text": "$9007199254740993.01",
      "decimalSeparator": ".",
      "groupingSeparator": ""
    })).toEqual({ ok: true, output: {
      "value": "9007199254740993.01"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "text": "-0.00 €",
      "decimalSeparator": ".",
      "groupingSeparator": ""
    })).toEqual({ ok: true, output: {
      "value": "0"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "text", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "text": "1,23.50",
      "decimalSeparator": ".",
      "groupingSeparator": ","
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "text", code: "invalid_decimal" }] } });
    expect(tool.execute({
      "text": "1€2",
      "decimalSeparator": ".",
      "groupingSeparator": ""
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "text", code: "invalid_decimal" }] } });
    expect(tool.execute({
      "text": "$12",
      "decimalSeparator": ".",
      "groupingSeparator": "."
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "groupingSeparator", code: "separator_conflict" }] } });
  });

  it("preserves a sign before a currency prefix", () => {
    expect(tool.execute({ text: "-$1,234.50", decimalSeparator: ".", groupingSeparator: "," })).toEqual({ ok: true, output: { value: "-1234.5" } });
  });
});
