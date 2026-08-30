import { describe, expect, it } from "vitest";
import {
  calculatePlatingWeightDeltaEstimate,
  example,
  runPlatingWeightDeltaEstimate,
} from "./tool.js";

describe("numismatics/plating-weight-delta-estimate", () => {
  it("calculates the published example", () => {
    expect(calculatePlatingWeightDeltaEstimate(example.input)).toEqual(
      example.output,
    );
    expect(runPlatingWeightDeltaEstimate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runPlatingWeightDeltaEstimate({
      ...example.input,
      platedWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
