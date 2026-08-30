import { describe, expect, it } from "vitest";
import {
  calculateMeltValueFromSpotSilver,
  example,
  runMeltValueFromSpotSilver,
} from "./tool.js";

describe("numismatics/melt-value-from-spot-silver", () => {
  it("calculates the published example", () => {
    expect(calculateMeltValueFromSpotSilver(example.input)).toEqual(
      example.output,
    );
    expect(runMeltValueFromSpotSilver(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runMeltValueFromSpotSilver({
      ...example.input,
      grossWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
