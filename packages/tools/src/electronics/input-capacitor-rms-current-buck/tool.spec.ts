import { describe, expect, it } from "vitest";
import {
  calculateInputCapacitorRmsCurrentBuck,
  inputCapacitorRmsCurrentBuckExample,
  runInputCapacitorRmsCurrentBuck,
} from "./tool.js";

describe("Input Cap RMS Current", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runInputCapacitorRmsCurrentBuck(
        inputCapacitorRmsCurrentBuckExample.input,
      ),
    ).toEqual({ ok: true, output: inputCapacitorRmsCurrentBuckExample.output });
  });

  it("matches the sqrt(D(1-D)) formula at a different duty cycle", () => {
    expect(
      calculateInputCapacitorRmsCurrentBuck({
        dutyFraction: 0.25,
        iOutA: 4,
      }).inputCapacitorRmsA,
    ).toBe(4 * Math.sqrt(0.25 * 0.75));
  });

  it("peaks at half the output current for a fifty percent duty cycle", () => {
    const result = calculateInputCapacitorRmsCurrentBuck({
      dutyFraction: 0.5,
      iOutA: 3,
    }).inputCapacitorRmsA;
    expect(result).toBe(1.5);
  });

  it("returns zero current at the duty extremes", () => {
    expect(
      calculateInputCapacitorRmsCurrentBuck({ dutyFraction: 0, iOutA: 2 })
        .inputCapacitorRmsA,
    ).toBe(0);
    expect(
      calculateInputCapacitorRmsCurrentBuck({ dutyFraction: 1, iOutA: 2 })
        .inputCapacitorRmsA,
    ).toBe(0);
  });

  it("is symmetric around a fifty percent duty cycle", () => {
    const low = calculateInputCapacitorRmsCurrentBuck({
      dutyFraction: 0.3,
      iOutA: 5,
    }).inputCapacitorRmsA;
    const high = calculateInputCapacitorRmsCurrentBuck({
      dutyFraction: 0.7,
      iOutA: 5,
    }).inputCapacitorRmsA;
    expect(high).toBeCloseTo(low, 15);
  });

  it("rejects non-positive output current", () => {
    expect(
      runInputCapacitorRmsCurrentBuck({ dutyFraction: 0.5, iOutA: 0 }).ok,
    ).toBe(false);
  });

  it("rejects duty fractions outside the unit interval", () => {
    expect(
      runInputCapacitorRmsCurrentBuck({ dutyFraction: -0.1, iOutA: 2 }).ok,
    ).toBe(false);
    expect(
      runInputCapacitorRmsCurrentBuck({ dutyFraction: 1.1, iOutA: 2 }).ok,
    ).toBe(false);
  });
});
