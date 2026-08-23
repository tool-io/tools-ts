import { describe, expect, it } from "vitest";
import {
  calculateJointLifeAnnuityEpv,
  jointLifeAnnuityEpvExample,
  runJointLifeAnnuityEpv,
} from "./tool.js";

describe("joint life annuity EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJointLifeAnnuityEpv(jointLifeAnnuityEpvExample.input)).toEqual({
      ok: true,
      output: jointLifeAnnuityEpvExample.output,
    });
  });

  it("pays only the first installment when one life dies within a year", () => {
    const result = calculateJointLifeAnnuityEpv({
      benefitAmount: 100,
      firstLifeDeathProbability: 0.5,
      interestRate: 0,
      secondLifeDeathProbability: 1,
    });
    expect(result.presentValue).toBe(100);
  });

  it("rejects a diverging series and invalid inputs", () => {
    expect(
      runJointLifeAnnuityEpv({
        benefitAmount: 10,
        firstLifeDeathProbability: 0,
        interestRate: 0,
        secondLifeDeathProbability: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "series_diverges" }] },
      ok: false,
    });
    expect(
      runJointLifeAnnuityEpv({
        benefitAmount: 10,
        firstLifeDeathProbability: -0.5,
        interestRate: 0.05,
        secondLifeDeathProbability: 0.5,
      }).ok,
    ).toBe(false);
  });
});
