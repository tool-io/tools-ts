import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, smartQuotesTypographicReplacerInputSchema, smartQuotesTypographicReplacerOutputSchema } from "./index.js";
describe("csv/smart-quotes-typographic-replacer", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, smartQuotesTypographicReplacerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, smartQuotesTypographicReplacerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        "‘yes’ «no»"
      ]
    })).toEqual({ ok: true, output: {
      "values": [
        "'yes' «no»"
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": []
    })).toEqual({ ok: true, output: {
      "values": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
