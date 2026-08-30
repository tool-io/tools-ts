import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, emCompoundingDepthCalculatorInputSchema, emCompoundingDepthCalculatorOutputSchema } from "./index.js";
describe("css/em-compounding-depth-calculator", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, emCompoundingDepthCalculatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, emCompoundingDepthCalculatorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "rootSize": 10,
      "multipliers": [
        2,
        0.5
      ]
    })).toEqual({ ok: true, output: {
      "fontSize": 10,
      "depth": 2
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "rootSize": 16,
      "multipliers": []
    })).toEqual({ ok: true, output: {
      "fontSize": 16,
      "depth": 0
    } });
    expect(tool.execute({
      "rootSize": 16,
      "multipliers": [
        0,
        1e+308
      ]
    })).toEqual({ ok: true, output: {
      "fontSize": 0,
      "depth": 2
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "rootSize", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, multipliers: [-1] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "multipliers.0", code: "out_of_range" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["rootSize", "multipliers"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects non-finite numeric inputs", () => {
    for (const field of ["rootSize"] as const) {
      for (const value of [NaN, Infinity, -Infinity]) {
        expect(tool.execute({ ...example.input, [field]: value })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
      }
    }
  });
  it("recovers after intermediate overflow or underflow", () => {
    for (const multipliers of [[1e200, 1e200, 1e-200, 1e-200], [1e-200, 1e-200, 1e200, 1e200]]) {
      const result = tool.execute({ rootSize: 16, multipliers });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.fontSize).toBeCloseTo(16, 10);
    }
  });
});
