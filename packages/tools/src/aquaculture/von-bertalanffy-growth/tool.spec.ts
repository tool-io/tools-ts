import { describe, expect, it } from "vitest";
import {
  calculateVonBertalanffyGrowth,
  example,
  runVonBertalanffyGrowth,
} from "./tool.js";

describe("aquaculture/von-bertalanffy-growth", () => {
  it("calculates the published example", () => {
    expect(calculateVonBertalanffyGrowth(example.input)).toEqual(
      example.output,
    );
    expect(runVonBertalanffyGrowth(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runVonBertalanffyGrowth({
      ...example.input,
      asymptoticLengthCentimeters: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("accepts a negative theoretical zero-length age", () => {
    expect(
      calculateVonBertalanffyGrowth({
        ...example.input,
        theoreticalAgeYears: -0.75,
      }).predictedLengthCentimeters,
    ).toBeCloseTo(68.33632306209468);
  });
});
