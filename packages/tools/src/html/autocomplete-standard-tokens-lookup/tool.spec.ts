import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, autocompleteStandardTokensLookupInputSchema, autocompleteStandardTokensLookupOutputSchema } from "./index.js";
describe("html/autocomplete-standard-tokens-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, autocompleteStandardTokensLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, autocompleteStandardTokensLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "tokens": [
    "cc-family-name",
    "home",
    "off"
  ]
})).toEqual({ ok: true, output: {
  "categories": [
    "field",
    "contact",
    "mode"
  ],
  "recognized": [
    true,
    true,
    true
  ]
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "tokens": []
})).toEqual({ ok: true, output: {
  "categories": [],
  "recognized": []
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "tokens", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
