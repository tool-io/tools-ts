import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, linkRelAlternateFeedTypeLookupInputSchema, linkRelAlternateFeedTypeLookupOutputSchema } from "./index.js";
describe("html/link-rel-alternate-feed-type-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, linkRelAlternateFeedTypeLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, linkRelAlternateFeedTypeLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "format": "rss",
  "href": "/rss.xml"
})).toEqual({ ok: true, output: {
  "mediaType": "application/rss+xml",
  "element": "<link rel=\"alternate\" type=\"application/rss+xml\" href=\"/rss.xml\">"
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "format", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
  "format": "rss",
  "href": ""
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "href", code: "invalid_format" }] } });
  });

});
