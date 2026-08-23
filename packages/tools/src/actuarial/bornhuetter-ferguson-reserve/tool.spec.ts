import { describe, expect, it } from "vitest";
import {
  bornhuetterFergusonReserveExample,
  calculateBornhuetterFergusonReserve,
  runBornhuetterFergusonReserve,
} from "./tool.js";

describe("Bornhuetter-Ferguson Reserve Calculator", () => {
  it("reproduces its canonical example", () => {
    expect(
      runBornhuetterFergusonReserve(bornhuetterFergusonReserveExample.input),
    ).toEqual({
      ok: true,
      output: bornhuetterFergusonReserveExample.output,
    });
  });

  it("allows an expected loss ratio above one hundred percent", () => {
    expect(
      calculateBornhuetterFergusonReserve({
        earnedPremium: 200000,
        expectedLossRatioPercent: 125,
        unreportedFraction: 0.2,
      }),
    ).toEqual({ ibnrReserve: 50000 });
  });

  it("returns zero when no ultimate losses remain unreported", () => {
    expect(
      runBornhuetterFergusonReserve({
        earnedPremium: 200000,
        expectedLossRatioPercent: 75,
        unreportedFraction: 0,
      }),
    ).toEqual({ ok: true, output: { ibnrReserve: 0 } });
  });

  it("rejects negative amounts, invalid fractions, and malformed input", () => {
    expect(
      runBornhuetterFergusonReserve({
        earnedPremium: -1,
        expectedLossRatioPercent: 75,
        unreportedFraction: 0.2,
      }).ok,
    ).toBe(false);
    expect(
      runBornhuetterFergusonReserve({
        earnedPremium: 100,
        expectedLossRatioPercent: 75,
        unreportedFraction: 1.1,
      }).ok,
    ).toBe(false);
    expect(runBornhuetterFergusonReserve(null).ok).toBe(false);
  });
});
