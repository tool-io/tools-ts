import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, foreignKeyColumnPairMatchRateInputSchema, foreignKeyColumnPairMatchRateOutputSchema } from "./index.js";
describe("csv/foreign-key-column-pair-match-rate", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, foreignKeyColumnPairMatchRateInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, foreignKeyColumnPairMatchRateOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "parentKeys": [
        "",
        "a",
        "a"
      ],
      "childKeys": [
        "",
        "a"
      ]
    })).toEqual({ ok: true, output: {
      "matchedCount": 2,
      "childCount": 2,
      "matchRate": 1,
      "hasChildren": true
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "parentKeys": [
        "a"
      ],
      "childKeys": []
    })).toEqual({ ok: true, output: {
      "matchedCount": 0,
      "childCount": 0,
      "matchRate": 0,
      "hasChildren": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "parentKeys", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
