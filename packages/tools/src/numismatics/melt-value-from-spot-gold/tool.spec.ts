import { describe, expect, it } from "vitest";
import {
  calculateMeltValueFromSpotGold,
  example,
  runMeltValueFromSpotGold,
} from "./tool.js";

describe("numismatics/melt-value-from-spot-gold", () => {
  it("calculates the published example", () => {
    expect(calculateMeltValueFromSpotGold(example.input)).toEqual(
      example.output,
    );
    expect(runMeltValueFromSpotGold(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runMeltValueFromSpotGold({
      ...example.input,
      grossWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
