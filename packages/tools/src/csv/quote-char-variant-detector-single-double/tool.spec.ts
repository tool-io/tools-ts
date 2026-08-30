import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, quoteCharVariantDetectorSingleDoubleInputSchema, quoteCharVariantDetectorSingleDoubleOutputSchema } from "./index.js";
describe("csv/quote-char-variant-detector-single-double", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, quoteCharVariantDetectorSingleDoubleInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, quoteCharVariantDetectorSingleDoubleOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "tokens": [
        "\"Ada\"",
        "'Grace'"
      ]
    })).toEqual({ ok: true, output: {
      "quoteCharacters": [
        "\"",
        "'"
      ],
      "ambiguous": true,
      "unrecognizedCount": 0
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "tokens": [
        "O'Brien"
      ]
    })).toEqual({ ok: true, output: {
      "quoteCharacters": [],
      "ambiguous": true,
      "unrecognizedCount": 1
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "tokens", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
