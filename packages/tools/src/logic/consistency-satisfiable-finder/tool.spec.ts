import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, consistencySatisfiableFinderInputSchema, consistencySatisfiableFinderOutputSchema } from "./index.js";
describe("logic/consistency-satisfiable-finder", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, consistencySatisfiableFinderInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, consistencySatisfiableFinderOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "columns": [
        "01",
        "10"
      ]
    })).toEqual({ ok: true, output: {
      "consistent": false,
      "satisfyingRows": []
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "columns": [
        "1"
      ]
    })).toEqual({ ok: true, output: {
      "consistent": true,
      "satisfyingRows": [
        0
      ]
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "columns", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "columns": [
        "01",
        "1"
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "columns", code: "length_mismatch" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["columns"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects trailing line breaks rather than interpreting them as false", () => {
    expect(tool.execute({ columns: ["1\n"] })).toMatchObject({ ok: false, error: { issues: [{ field: "columns.0", code: "invalid_format" }] } });
  });
});
