import { describe, expect, it } from "vitest";
import {
  calculateSalinityAdjustment,
  example,
  runSalinityAdjustment,
} from "./tool.js";

describe("aquaculture/salinity-adjustment", () => {
  it("calculates the published example", () => {
    expect(calculateSalinityAdjustment(example.input)).toEqual(example.output);
    expect(runSalinityAdjustment(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runSalinityAdjustment({
      ...example.input,
      salinityIncreasePpt: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
