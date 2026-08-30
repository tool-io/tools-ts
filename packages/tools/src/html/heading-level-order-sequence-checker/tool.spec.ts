import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, headingLevelOrderSequenceCheckerInputSchema, headingLevelOrderSequenceCheckerOutputSchema } from "./index.js";
describe("html/heading-level-order-sequence-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, headingLevelOrderSequenceCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, headingLevelOrderSequenceCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "levels": [
    3,
    2,
    1
  ]
})).toEqual({ ok: true, output: {
  "skippedAt": [],
  "hasUpwardSkips": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "levels": []
})).toEqual({ ok: true, output: {
  "skippedAt": [],
  "hasUpwardSkips": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "levels", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
