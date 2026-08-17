import { describe, expect, it } from "vitest";
import {
  calculateEffectiveAnnualRate,
  effectiveAnnualRateExample,
  runEffectiveAnnualRate,
} from "./tool.js";

describe("effective annual rate calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEffectiveAnnualRate(effectiveAnnualRateExample.input)).toEqual({
      ok: true,
      output: effectiveAnnualRateExample.output,
    });
  });

  it("matches the nominal rate for annual compounding", () => {
    expect(
      calculateEffectiveAnnualRate({ nominalAnnualRatePercent: 7.25 }),
    ).toEqual({ effectiveAnnualRatePercent: 7.25 });
  });

  it("increases with compounding frequency", () => {
    const monthly = calculateEffectiveAnnualRate({
      nominalAnnualRatePercent: 12,
      periodsPerYear: 12,
    });
    const quarterly = calculateEffectiveAnnualRate({
      nominalAnnualRatePercent: 12,
      periodsPerYear: 4,
    });
    expect(monthly.effectiveAnnualRatePercent).toBeGreaterThan(
      quarterly.effectiveAnnualRatePercent,
    );
  });

  it("rejects invalid periods and impossible rates", () => {
    expect(
      runEffectiveAnnualRate({
        nominalAnnualRatePercent: 10,
        periodsPerYear: 0,
      }).ok,
    ).toBe(false);
    expect(
      runEffectiveAnnualRate({
        nominalAnnualRatePercent: -500,
        periodsPerYear: 2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_rate" }] },
      ok: false,
    });
  });
});
