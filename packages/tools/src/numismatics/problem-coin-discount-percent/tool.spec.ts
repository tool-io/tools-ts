import { describe, expect, it } from "vitest";
import {
  calculateProblemCoinDiscountPercent,
  example,
  runProblemCoinDiscountPercent,
} from "./tool.js";

describe("numismatics/problem-coin-discount-percent", () => {
  it("calculates the published example", () => {
    expect(calculateProblemCoinDiscountPercent(example.input)).toEqual(
      example.output,
    );
    expect(runProblemCoinDiscountPercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runProblemCoinDiscountPercent({
      ...example.input,
      problemCoinPrice: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runProblemCoinDiscountPercent({
        ...example.input,
        straightGradePrice: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "straightGradePrice" }] },
    });
  });
  it("rejects a negative discount scenario", () => {
    expect(
      runProblemCoinDiscountPercent({
        ...example.input,
        problemCoinPrice: example.input.straightGradePrice + 1,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "problemCoinPrice" }] },
    });
  });
});
