import { describe, expect, it } from "vitest";
import {
  runShellCompanyIndicator,
  scoreShellCompanyIndicators,
  shellCompanyIndicatorExample,
} from "./tool.js";

describe("shell company indicator lookup", () => {
  it("reproduces its canonical example", () => {
    expect(
      runShellCompanyIndicator(shellCompanyIndicatorExample.input),
    ).toEqual({
      ok: true,
      output: shellCompanyIndicatorExample.output,
    });
  });

  it("returns a zero score with no indicators", () => {
    expect(
      scoreShellCompanyIndicators({
        employeeCount: 5,
        nomineeCount: 0,
        registeredAddressSharedCount: 0,
        registrationAgeDays: 730,
        scoreThreshold: 25,
      }),
    ).toMatchObject({
      indicatorCount: 0,
      riskScore: 0,
      highIndicatorRisk: false,
    });
  });

  it("flags a score exactly at the threshold", () => {
    expect(
      scoreShellCompanyIndicators({
        employeeCount: 0,
        nomineeCount: 0,
        registeredAddressSharedCount: 0,
        registrationAgeDays: 100,
        scoreThreshold: 25,
      }).highIndicatorRisk,
    ).toBe(true);
  });

  it("rejects a negative indicator count", () => {
    expect(
      runShellCompanyIndicator({
        employeeCount: -1,
        nomineeCount: 0,
        registeredAddressSharedCount: 0,
        registrationAgeDays: 100,
        scoreThreshold: 25,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "employeeCount" }],
      },
      ok: false,
    });
  });
});
