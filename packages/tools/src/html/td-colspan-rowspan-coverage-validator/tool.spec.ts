import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, tdColspanRowspanCoverageValidatorInputSchema, tdColspanRowspanCoverageValidatorOutputSchema } from "./index.js";
describe("html/td-colspan-rowspan-coverage-validator", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, tdColspanRowspanCoverageValidatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tdColspanRowspanCoverageValidatorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "rows": 1,
  "columns": 2,
  "startRows": [
    0,
    0
  ],
  "startColumns": [
    0,
    0
  ],
  "rowspans": [
    1,
    1
  ],
  "colspans": [
    1,
    2
  ]
})).toEqual({ ok: true, output: {
  "coveredSlots": 2,
  "uncoveredSlots": 0,
  "overlappingSlots": 1,
  "completeWithoutOverlap": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "rows": 1,
  "columns": 1,
  "startRows": [],
  "startColumns": [],
  "rowspans": [],
  "colspans": []
})).toEqual({ ok: true, output: {
  "coveredSlots": 0,
  "uncoveredSlots": 1,
  "overlappingSlots": 0,
  "completeWithoutOverlap": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "rows", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, startColumns: [] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "length_mismatch" }] } });
    expect(tool.execute({ ...example.input, rows: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "startRows.1", code: "outside_grid" }] } });
  });

  it("bounds occupancy and rejects cells beyond the supplied columns", () => {
    expect(tool.execute({ rows: 1, columns: 2, startRows: [0], startColumns: [1], rowspans: [0], colspans: [2] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "startRows.0", code: "outside_grid" }] } });
    expect(tool.execute({ ...example.input, rows: 101 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "rows", code: "out_of_range" }] } });
  });
});
