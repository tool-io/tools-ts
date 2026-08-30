import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, openGraphRequiredTagsCheckerInputSchema, openGraphRequiredTagsCheckerOutputSchema } from "./index.js";
describe("html/open-graph-required-tags-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, openGraphRequiredTagsCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, openGraphRequiredTagsCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "properties": [
    "og:title",
    "og:type",
    "og:image",
    "og:url"
  ],
  "contents": [
    "Field notes",
    "article",
    "cover.png",
    "https://example.org/notes"
  ]
})).toEqual({ ok: true, output: {
  "missing": [],
  "complete": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "properties": [],
  "contents": []
})).toEqual({ ok: true, output: {
  "missing": [
    "og:title",
    "og:type",
    "og:image",
    "og:url"
  ],
  "complete": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "properties", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
  "properties": [
    "og:title"
  ],
  "contents": []
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "contents", code: "length_mismatch" }] } });
  });

});
