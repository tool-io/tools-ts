import { describe, expect, it } from "vitest";
import {
  calculateGoldFinenessWeightContent,
  example,
  runGoldFinenessWeightContent,
} from "./tool.js";

describe("numismatics/gold-fineness-weight-content", () => {
  it("calculates the published example", () => {
    expect(calculateGoldFinenessWeightContent(example.input)).toEqual(
      example.output,
    );
    expect(runGoldFinenessWeightContent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runGoldFinenessWeightContent({
      ...example.input,
      grossWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
