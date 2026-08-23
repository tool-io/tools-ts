import { describe, expect, it } from "vitest";
import {
  calculateZillmerReserve,
  runZillmerReserve,
  zillmerReserveExample,
} from "./tool.js";

describe("zillmer reserve calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runZillmerReserve(zillmerReserveExample.input)).toEqual({
      ok: true,
      output: zillmerReserveExample.output,
    });
  });

  it("produces lower reserves than an unmodified valuation", () => {
    const unmodified = calculateZillmerReserve({
      benefitAmount: 100,
      durationYears: 1,
      initialDeathProbability: 0.3,
      interestRate: 0,
      renewalDeathProbability: 0.1,
      zillmerAllowance: 0,
    });
    expect(unmodified.zillmerReserve).toBe(-25);
    expect(zillmerReserveExample.output.zillmerReserve).toBeLessThan(
      unmodified.zillmerReserve,
    );
  });

  it("rejects invalid inputs", () => {
    expect(
      runZillmerReserve({
        benefitAmount: 100,
        durationYears: 1,
        initialDeathProbability: 0.3,
        interestRate: 0,
        renewalDeathProbability: 0.1,
        zillmerAllowance: -0.5,
      }).ok,
    ).toBe(false);
    expect(
      runZillmerReserve({
        benefitAmount: 100,
        durationYears: -1,
        initialDeathProbability: 0.3,
        interestRate: 0,
        renewalDeathProbability: 0.1,
      }).ok,
    ).toBe(false);
  });
});
