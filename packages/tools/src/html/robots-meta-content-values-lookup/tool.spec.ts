import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, robotsMetaContentValuesLookupInputSchema, robotsMetaContentValuesLookupOutputSchema } from "./index.js";
describe("html/robots-meta-content-values-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, robotsMetaContentValuesLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, robotsMetaContentValuesLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "content": "NONE"
})).toEqual({ ok: true, output: {
  "indexAllowed": false,
  "followAllowed": false,
  "recognized": [
    "none"
  ],
  "unhandled": []
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "content": ""
})).toEqual({ ok: true, output: {
  "indexAllowed": true,
  "followAllowed": true,
  "recognized": [],
  "unhandled": []
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "content", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
