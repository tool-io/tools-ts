import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, headerRowDetectionHeuristicInputSchema, headerRowDetectionHeuristicOutputSchema } from "./index.js";
describe("csv/header-row-detection-heuristic", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, headerRowDetectionHeuristicInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, headerRowDetectionHeuristicOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "36,85\n40,90",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "likelyHeader": false,
      "evidenceColumns": 0,
      "columnCount": 2
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "name,city\nAda,London",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "likelyHeader": false,
      "evidenceColumns": 0,
      "columnCount": 2
    } });
    expect(tool.execute({
      "csv": "",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "likelyHeader": false,
      "evidenceColumns": 0,
      "columnCount": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
