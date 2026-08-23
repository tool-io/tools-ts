import { describe, expect, it } from "vitest";
import {
  calculateLastSurvivorAnnuityEpv,
  lastSurvivorAnnuityEpvExample,
  runLastSurvivorAnnuityEpv,
} from "./tool.js";

describe("last survivor annuity EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLastSurvivorAnnuityEpv(lastSurvivorAnnuityEpvExample.input),
    ).toEqual({
      ok: true,
      output: lastSurvivorAnnuityEpvExample.output,
    });
  });

  it("exceeds the joint life annuity for identical lives", () => {
    const last = calculateLastSurvivorAnnuityEpv({
      benefitAmount: 10,
      firstLifeDeathProbability: 0.5,
      interestRate: 0,
      secondLifeDeathProbability: 0.5,
    });
    expect(last.presentValue).toBeGreaterThan(13.3333333333);
  });

  it("rejects a diverging series and invalid inputs", () => {
    expect(
      runLastSurvivorAnnuityEpv({
        benefitAmount: 10,
        firstLifeDeathProbability: 0,
        interestRate: 0,
        secondLifeDeathProbability: 0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "series_diverges" }] },
      ok: false,
    });
    expect(
      runLastSurvivorAnnuityEpv({
        benefitAmount: 10,
        firstLifeDeathProbability: 1.2,
        interestRate: 0.05,
        secondLifeDeathProbability: 0.5,
      }).ok,
    ).toBe(false);
  });
});
