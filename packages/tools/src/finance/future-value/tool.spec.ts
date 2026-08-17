import { describe, expect, it } from "vitest";
import { calculateFutureValue, futureValueExample, runFutureValue } from "./tool.js";

describe("future value calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFutureValue(futureValueExample.input)).toEqual({
      ok: true,
      output: futureValueExample.output,
    });
  });

  it("keeps the present value for zero rate and zero years", () => {
    expect(
      calculateFutureValue({ annualRatePercent: 5, presentValue: 80, years: 0 }),
    ).toEqual({ futureValue: 80 });
    expect(
      calculateFutureValue({
        annualRatePercent: 0,
        presentValue: 80,
        years: 10,
      }),
    ).toEqual({ futureValue: 80 });
  });

  it("compounds more often to a higher balance", () => {
    const quarterly = calculateFutureValue({
      annualRatePercent: 12,
      compoundingPerYear: 4,
      presentValue: 1000,
      years: 1,
    });
    const annual = calculateFutureValue({
      annualRatePercent: 12,
      compoundingPerYear: 1,
      presentValue: 1000,
      years: 1,
    });
    expect(quarterly.futureValue).toBeGreaterThan(annual.futureValue);
  });

  it("rejects negative years and impossible rates", () => {
    expect(
      runFutureValue({
        annualRatePercent: 10,
        presentValue: 100,
        years: -1,
      }).ok,
    ).toBe(false);
    expect(
      runFutureValue({
        annualRatePercent: -400,
        compoundingPerYear: 2,
        presentValue: 100,
        years: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_rate" }] },
      ok: false,
    });
  });
});
