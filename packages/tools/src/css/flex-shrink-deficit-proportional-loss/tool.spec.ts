import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, flexShrinkDeficitProportionalLossInputSchema, flexShrinkDeficitProportionalLossOutputSchema } from "./index.js";
describe("css/flex-shrink-deficit-proportional-loss", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, flexShrinkDeficitProportionalLossInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, flexShrinkDeficitProportionalLossOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "deficit": 90,
      "baseSizes": [
        100,
        100
      ],
      "shrinkFactors": [
        1,
        2
      ]
    })).toEqual({ ok: true, output: {
      "losses": [
        30,
        60
      ],
      "undistributedDeficit": 0
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "deficit": 20,
      "baseSizes": [
        0,
        100
      ],
      "shrinkFactors": [
        1,
        0
      ]
    })).toEqual({ ok: true, output: {
      "losses": [
        0,
        0
      ],
      "undistributedDeficit": 20
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "deficit", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, shrinkFactors: [1] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "shrinkFactors", code: "length_mismatch" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["deficit", "baseSizes", "shrinkFactors"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects non-finite numeric inputs", () => {
    for (const field of ["deficit"] as const) {
      for (const value of [NaN, Infinity, -Infinity]) {
        expect(tool.execute({ ...example.input, [field]: value })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
      }
    }
  });
  it("honors partial flex filling and avoids intermediate weight range loss", () => {
    expect(tool.execute({ deficit: 40, baseSizes: [100, 100], shrinkFactors: [0.25, 0.25] })).toEqual({ ok: true, output: { losses: [10, 10], undistributedDeficit: 20 } });
    const result = tool.execute({ deficit: 100, baseSizes: [1e308, 1e-308], shrinkFactors: [1e-308, 1e308] });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.losses[0]).toBeCloseTo(50, 10);
      expect(result.output.losses[1]).toBeCloseTo(50, 10);
      expect(Number.isFinite(result.output.undistributedDeficit)).toBe(true);
    }
  });
  it("scales weights whose products overflow or underflow", () => {
    expect(tool.execute({ deficit: 100, baseSizes: [1e308, 1e308], shrinkFactors: [1e308, 1e308] })).toEqual({ ok: true, output: { losses: [50, 50], undistributedDeficit: 0 } });
    const tiny = tool.execute({ deficit: 1e308, baseSizes: [1e-308, 1e-308], shrinkFactors: [1e-308, 1e-308] });
    expect(tiny.ok).toBe(true);
    if (tiny.ok) {
      expect(tiny.output.losses[0]).toBeCloseTo(1, 12);
      expect(tiny.output.losses[1]).toBeCloseTo(1, 12);
    }
  });
});
