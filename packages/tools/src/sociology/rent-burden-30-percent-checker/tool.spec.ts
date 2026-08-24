import { describe, expect, it } from "vitest";
import {
  calculateRentBurden,
  rentBurden30PercentCheckerExample,
  rentBurden30PercentCheckerTool,
  runRentBurden30PercentChecker,
} from "./tool.js";

describe("rentBurden30PercentCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runRentBurden30PercentChecker(rentBurden30PercentCheckerExample.input),
    ).toEqual({
      ok: true,
      output: rentBurden30PercentCheckerExample.output,
    });
  });

  it("classifies exactly thirty percent as rent burdened", () => {
    expect(
      calculateRentBurden({ monthlyGrossIncome: 1000, monthlyRent: 300 }),
    ).toEqual({ burdenPercent: 30, rentBurdened: true });
    const result = runRentBurden30PercentChecker({
      monthlyGrossIncome: 0,
      monthlyRent: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("monthlyGrossIncome");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(rentBurden30PercentCheckerExample)),
    ).toEqual(rentBurden30PercentCheckerExample);
    expect(rentBurden30PercentCheckerTool.contractVersion).toBe(1);
    expect(rentBurden30PercentCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runRentBurden30PercentChecker(null).ok).toBe(false);
    expect(
      runRentBurden30PercentChecker({
        ...rentBurden30PercentCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
