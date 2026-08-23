import { describe, expect, it } from "vitest";
import {
  calculateRetrospectiveNetReserve,
  retrospectiveNetReserveExample,
  runRetrospectiveNetReserve,
} from "./tool.js";

describe("retrospective net reserve calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRetrospectiveNetReserve(retrospectiveNetReserveExample.input),
    ).toEqual({
      ok: true,
      output: retrospectiveNetReserveExample.output,
    });
  });

  it("grows with the premium charged", () => {
    const low = calculateRetrospectiveNetReserve({
      benefitAmount: 100,
      durationYears: 2,
      initialDeathProbability: 0.3,
      interestRate: 0,
      netAnnualPremium: 40,
      renewalDeathProbability: 0.1,
    });
    const high = calculateRetrospectiveNetReserve({
      benefitAmount: 100,
      durationYears: 2,
      initialDeathProbability: 0.3,
      interestRate: 0,
      netAnnualPremium: 50,
      renewalDeathProbability: 0.1,
    });
    expect(high.retrospectiveReserve).toBeGreaterThan(low.retrospectiveReserve);
  });

  it("rejects certain first-year death and invalid inputs", () => {
    expect(
      runRetrospectiveNetReserve({
        ...retrospectiveNetReserveExample.input,
        initialDeathProbability: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
    expect(
      runRetrospectiveNetReserve(
        retrospectiveNetReserveExample.input && {
          ...retrospectiveNetReserveExample.input,
          durationYears: 0,
        },
      ).ok,
    ).toBe(false);
    expect(
      runRetrospectiveNetReserve({
        benefitAmount: 100,
        durationYears: 2,
        initialDeathProbability: 0.3,
        interestRate: -1,
        netAnnualPremium: 40,
        renewalDeathProbability: 0.1,
      }).ok,
    ).toBe(false);
  });

  it("rejects a valuation duration with no surviving policies", () => {
    expect(
      runRetrospectiveNetReserve({
        ...retrospectiveNetReserveExample.input,
        renewalDeathProbability: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "no_survivors_at_duration",
            field: "renewalDeathProbability",
          },
        ],
      },
      ok: false,
    });
  });
});
