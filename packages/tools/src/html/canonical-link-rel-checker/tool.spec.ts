import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, canonicalLinkRelCheckerInputSchema, canonicalLinkRelCheckerOutputSchema } from "./index.js";
describe("html/canonical-link-rel-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, canonicalLinkRelCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, canonicalLinkRelCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "rel": "alternate canonical",
  "href": ""
})).toEqual({ ok: true, output: {
  "canonicalRelation": true,
  "nonemptyHref": false,
  "passes": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "rel": "notcanonical",
  "href": "/x"
})).toEqual({ ok: true, output: {
  "canonicalRelation": false,
  "nonemptyHref": true,
  "passes": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "rel", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
