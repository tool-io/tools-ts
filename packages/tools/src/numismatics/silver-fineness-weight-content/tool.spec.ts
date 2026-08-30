import { describe, expect, it } from "vitest";
import {
  calculateSilverFinenessWeightContent,
  example,
  runSilverFinenessWeightContent,
} from "./tool.js";

describe("numismatics/silver-fineness-weight-content", () => {
  it("calculates the published example", () => {
    expect(calculateSilverFinenessWeightContent(example.input)).toEqual(
      example.output,
    );
    expect(runSilverFinenessWeightContent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runSilverFinenessWeightContent({
      ...example.input,
      grossWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
