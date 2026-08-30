import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, anchorTargetValuesLookupInputSchema, anchorTargetValuesLookupOutputSchema } from "./index.js";
describe("html/anchor-target-values-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, anchorTargetValuesLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, anchorTargetValuesLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "target": "preview"
})).toEqual({ ok: true, output: {
  "kind": "named",
  "keyword": "",
  "valid": true
} });
    expect(tool.execute({
  "target": "_unknown"
})).toEqual({ ok: true, output: {
  "kind": "invalid",
  "keyword": "",
  "valid": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "target": ""
})).toEqual({ ok: true, output: {
  "kind": "empty",
  "keyword": "",
  "valid": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "target", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
