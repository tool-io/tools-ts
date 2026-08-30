import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, hreflangAlternateLangPairsLookupInputSchema, hreflangAlternateLangPairsLookupOutputSchema } from "./index.js";
describe("html/hreflang-alternate-lang-pairs-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, hreflangAlternateLangPairsLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, hreflangAlternateLangPairsLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "languages": [
    "en",
    "fr"
  ],
  "hrefs": [
    "/en",
    ""
  ]
})).toEqual({ ok: true, output: {
  "emptyAt": [
    1
  ],
  "duplicateLanguageAt": [],
  "locallyComplete": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "languages": [],
  "hrefs": []
})).toEqual({ ok: true, output: {
  "emptyAt": [],
  "duplicateLanguageAt": [],
  "locallyComplete": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "languages", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, hrefs: [] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "hrefs", code: "length_mismatch" }] } });
  });

});
