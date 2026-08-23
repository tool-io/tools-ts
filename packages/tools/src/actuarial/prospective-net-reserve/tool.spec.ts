import { describe, expect, it } from "vitest";
import {
  calculateProspectiveNetReserve,
  prospectiveNetReserveExample,
  runProspectiveNetReserve,
} from "./tool.js";

const baseInput = {
  benefitAmount: 100,
  durationYears: 1,
  initialDeathProbability: 0.3,
  interestRate: 0,
  netAnnualPremium: 5,
  renewalDeathProbability: 0.1,
};

describe("prospective net reserve calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runProspectiveNetReserve(prospectiveNetReserveExample.input),
    ).toEqual({
      ok: true,
      output: prospectiveNetReserveExample.output,
    });
  });

  it("values the issue basis at duration zero", () => {
    const result = calculateProspectiveNetReserve({
      ...baseInput,
      durationYears: 0,
      netAnnualPremium: 12.5,
    });
    expect(result.prospectiveReserve).toBe(0);
  });

  it("rejects a diverging series and invalid inputs", () => {
    expect(
      runProspectiveNetReserve({ ...baseInput, renewalDeathProbability: 0 }).ok,
    ).toBe(false);
    expect(
      runProspectiveNetReserve({ ...baseInput, durationYears: -3 }).ok,
    ).toBe(false);
  });
});
