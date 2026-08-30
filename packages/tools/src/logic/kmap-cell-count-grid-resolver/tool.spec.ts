import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, kmapCellCountGridResolverInputSchema, kmapCellCountGridResolverOutputSchema } from "./index.js";
describe("logic/kmap-cell-count-grid-resolver", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, kmapCellCountGridResolverInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, kmapCellCountGridResolverOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "variableCount": 4
    })).toEqual({ ok: true, output: {
      "cellCount": 16,
      "rowCount": 4,
      "columnCount": 4,
      "rowVariables": 2,
      "columnVariables": 2
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "variableCount": 0
    })).toEqual({ ok: true, output: {
      "cellCount": 1,
      "rowCount": 1,
      "columnCount": 1,
      "rowVariables": 0,
      "columnVariables": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "variableCount", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["variableCount"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects non-finite numeric inputs", () => {
    for (const field of ["variableCount"] as const) {
      for (const value of [NaN, Infinity, -Infinity]) {
        expect(tool.execute({ ...example.input, [field]: value })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
      }
    }
  });
  it("keeps the largest accepted count within safe integer range", () => {
    expect(tool.execute({ variableCount: 52 })).toEqual({ ok: true, output: { cellCount: 4503599627370496, rowCount: 67108864, columnCount: 67108864, rowVariables: 26, columnVariables: 26 } });
    expect(tool.execute({ variableCount: 53 })).toMatchObject({ ok: false, error: { issues: [{ field: "variableCount", code: "out_of_range" }] } });
  });
});
