import { describe, expect, it } from "vitest";
import {
  calculateReversionaryAnnuityEpv,
  reversionaryAnnuityEpvExample,
  runReversionaryAnnuityEpv,
} from "./tool.js";

describe("reversionary annuity EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runReversionaryAnnuityEpv(reversionaryAnnuityEpvExample.input),
    ).toEqual({
      ok: true,
      output: reversionaryAnnuityEpvExample.output,
    });
  });

  it("equals zero when both lives cannot die", () => {
    expect(
      calculateReversionaryAnnuityEpv({
        benefitAmount: 100,
        firstLifeDeathProbability: 0,
        interestRate: 0.5,
        secondLifeDeathProbability: 0,
      }).presentValue,
    ).toBe(0);
  });

  it("rejects invalid inputs", () => {
    expect(
      runReversionaryAnnuityEpv({
        benefitAmount: -5,
        firstLifeDeathProbability: 0.5,
        interestRate: 0,
        secondLifeDeathProbability: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runReversionaryAnnuityEpv({
        benefitAmount: 10,
        interestRate: 0,
        secondLifeDeathProbability: 0.5,
      }).ok,
    ).toBe(false);
  });
});
