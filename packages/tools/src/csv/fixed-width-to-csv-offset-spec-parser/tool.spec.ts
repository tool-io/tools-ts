import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, fixedWidthToCsvOffsetSpecParserInputSchema, fixedWidthToCsvOffsetSpecParserOutputSchema } from "./index.js";
describe("csv/fixed-width-to-csv-offset-spec-parser", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, fixedWidthToCsvOffsetSpecParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, fixedWidthToCsvOffsetSpecParserOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "text": "ab\"cd",
      "offsets": [
        0,
        2
      ]
    })).toEqual({ ok: true, output: {
      "csv": "ab,\"\"\"cd\""
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "text": "\n",
      "offsets": [
        0
      ]
    })).toEqual({ ok: true, output: {
      "csv": "\"\""
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "text", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "text": "abcd",
      "offsets": [
        1
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "offsets", code: "invalid_offsets" }] } });
    expect(tool.execute({
      "text": "a",
      "offsets": [
        0,
        2
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "text", code: "short_line" }] } });
  });

});
