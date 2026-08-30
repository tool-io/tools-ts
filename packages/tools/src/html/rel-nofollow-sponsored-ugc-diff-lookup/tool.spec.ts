import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, relNofollowSponsoredUgcDiffLookupInputSchema, relNofollowSponsoredUgcDiffLookupOutputSchema } from "./index.js";
describe("html/rel-nofollow-sponsored-ugc-diff-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, relNofollowSponsoredUgcDiffLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, relNofollowSponsoredUgcDiffLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "rel": "UGC"
})).toEqual({ ok: true, output: {
  "nofollow": false,
  "sponsored": false,
  "userGenerated": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "rel": ""
})).toEqual({ ok: true, output: {
  "nofollow": false,
  "sponsored": false,
  "userGenerated": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "rel", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
