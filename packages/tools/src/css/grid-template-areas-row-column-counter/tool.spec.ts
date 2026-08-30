import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, gridTemplateAreasRowColumnCounterInputSchema, gridTemplateAreasRowColumnCounterOutputSchema } from "./index.js";
describe("css/grid-template-areas-row-column-counter", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, gridTemplateAreasRowColumnCounterInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, gridTemplateAreasRowColumnCounterOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "rows": [
        "... a..b"
      ]
    })).toEqual({ ok: true, output: {
      "rowCount": 1,
      "columnCount": 4,
      "areaNames": [
        "a",
        "b"
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "rows": [
        "."
      ]
    })).toEqual({ ok: true, output: {
      "rowCount": 1,
      "columnCount": 1,
      "areaNames": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "rows", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "rows": [
        "a a",
        "a ."
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "rows", code: "non_rectangular_area" }] } });
    expect(tool.execute({
      "rows": [
        "a b",
        "a"
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "rows.1", code: "invalid_grid" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["rows"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects disjoint named areas and non-cell punctuation", () => {
    expect(tool.execute({ rows: ["a . a"] })).toMatchObject({ ok: false, error: { issues: [{ field: "rows", code: "non_rectangular_area" }] } });
    expect(tool.execute({ rows: ["a #"] })).toMatchObject({ ok: false, error: { issues: [{ field: "rows.0", code: "invalid_token" }] } });
    expect(tool.execute({ rows: ["a a", "a a"] })).toEqual({ ok: true, output: { rowCount: 2, columnCount: 2, areaNames: ["a"] } });
  });
});
