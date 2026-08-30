import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, baseHrefSingleInstanceWarningInputSchema, baseHrefSingleInstanceWarningOutputSchema } from "./index.js";
describe("html/base-href-single-instance-warning", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, baseHrefSingleInstanceWarningInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, baseHrefSingleInstanceWarningOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "hrefs": [
    ""
  ]
})).toEqual({ ok: true, output: {
  "count": 1,
  "hasBase": true,
  "multiple": false,
  "firstHref": ""
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "hrefs": []
})).toEqual({ ok: true, output: {
  "count": 0,
  "hasBase": false,
  "multiple": false,
  "firstHref": ""
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "hrefs", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
