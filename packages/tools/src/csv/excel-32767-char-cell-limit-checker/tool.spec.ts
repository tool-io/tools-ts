import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, excel32767CharCellLimitCheckerInputSchema, excel32767CharCellLimitCheckerOutputSchema } from "./index.js";
describe("csv/excel-32767-char-cell-limit-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, excel32767CharCellLimitCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, excel32767CharCellLimitCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "characterCounts": [
        32767
      ]
    })).toEqual({ ok: true, output: {
      "fits": true,
      "limit": 32767,
      "overLimitIndices": []
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "characterCounts": []
    })).toEqual({ ok: true, output: {
      "fits": true,
      "limit": 32767,
      "overLimitIndices": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "characterCounts", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
