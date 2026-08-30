import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, selectOptgroupNestingRulesCheckerInputSchema, selectOptgroupNestingRulesCheckerOutputSchema } from "./index.js";
describe("html/select-optgroup-nesting-rules-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, selectOptgroupNestingRulesCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, selectOptgroupNestingRulesCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "tags": [
    "option"
  ],
  "parents": [
    "select"
  ]
})).toEqual({ ok: true, output: {
  "invalidAt": [],
  "valid": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "tags": [],
  "parents": []
})).toEqual({ ok: true, output: {
  "invalidAt": [],
  "valid": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "tags", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
  "tags": [
    "option"
  ],
  "parents": []
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "parents", code: "length_mismatch" }] } });
  });

});
