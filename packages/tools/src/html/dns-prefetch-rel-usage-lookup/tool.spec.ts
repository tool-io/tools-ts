import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, dnsPrefetchRelUsageLookupInputSchema, dnsPrefetchRelUsageLookupOutputSchema } from "./index.js";
describe("html/dns-prefetch-rel-usage-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, dnsPrefetchRelUsageLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, dnsPrefetchRelUsageLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "rel": "preconnect",
  "href": "//assets.example.org"
})).toEqual({ ok: true, output: {
  "dnsPrefetchRelation": false,
  "nonemptyHref": true,
  "hintPresent": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "rel": "dns-prefetch",
  "href": ""
})).toEqual({ ok: true, output: {
  "dnsPrefetchRelation": true,
  "nonemptyHref": false,
  "hintPresent": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "rel", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
