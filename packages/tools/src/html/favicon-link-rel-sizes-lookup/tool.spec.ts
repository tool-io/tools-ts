import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, faviconLinkRelSizesLookupInputSchema, faviconLinkRelSizesLookupOutputSchema } from "./index.js";
describe("html/favicon-link-rel-sizes-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, faviconLinkRelSizesLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, faviconLinkRelSizesLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "rel": "ICON",
  "sizes": "016x16"
})).toEqual({ ok: true, output: {
  "iconRelation": true,
  "validSizes": false,
  "scalable": false,
  "widths": [],
  "heights": []
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "rel": "stylesheet",
  "sizes": ""
})).toEqual({ ok: true, output: {
  "iconRelation": false,
  "validSizes": true,
  "scalable": false,
  "widths": [],
  "heights": []
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "rel", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
