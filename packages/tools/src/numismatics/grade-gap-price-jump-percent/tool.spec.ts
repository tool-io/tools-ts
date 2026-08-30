import { describe, expect, it } from "vitest";
import {
  calculateGradeGapPriceJumpPercent,
  example,
  runGradeGapPriceJumpPercent,
} from "./tool.js";

describe("numismatics/grade-gap-price-jump-percent", () => {
  it("calculates the published example", () => {
    expect(calculateGradeGapPriceJumpPercent(example.input)).toEqual(
      example.output,
    );
    expect(runGradeGapPriceJumpPercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runGradeGapPriceJumpPercent({
      ...example.input,
      higherGradePrice: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runGradeGapPriceJumpPercent({ ...example.input, lowerGradePrice: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "lowerGradePrice" }] },
    });
  });
});
