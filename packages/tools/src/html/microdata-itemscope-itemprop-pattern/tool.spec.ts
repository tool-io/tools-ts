import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, microdataItemscopeItempropPatternInputSchema, microdataItemscopeItempropPatternOutputSchema } from "./index.js";
describe("html/microdata-itemscope-itemprop-pattern", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, microdataItemscopeItempropPatternInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, microdataItemscopeItempropPatternOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "itemscope": false,
  "hasItemprop": true,
  "itemprop": "name name"
})).toEqual({ ok: true, output: {
  "introducesItem": false,
  "propertyNames": [
    "name"
  ],
  "nestedItemValue": false,
  "uniqueNonemptyProperties": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "itemscope": true,
  "hasItemprop": false,
  "itemprop": ""
})).toEqual({ ok: true, output: {
  "introducesItem": true,
  "propertyNames": [],
  "nestedItemValue": false,
  "uniqueNonemptyProperties": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "itemscope", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
