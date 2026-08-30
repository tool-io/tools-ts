import { describe, expect, it } from "vitest";
import {
  clientAcceptanceRiskExample,
  runClientAcceptanceRisk,
  screenClientAcceptanceRisks,
} from "./tool.js";

describe("client acceptance continuance risk screening", () => {
  it("reproduces its canonical example", () => {
    expect(runClientAcceptanceRisk(clientAcceptanceRiskExample.input)).toEqual({
      ok: true,
      output: clientAcceptanceRiskExample.output,
    });
  });

  it("fails the screen when one rating reaches the threshold", () => {
    expect(
      screenClientAcceptanceRisks({
        acceptanceThreshold: 3,
        riskRatings: [1, 2, 3],
      }),
    ).toMatchObject({ highRiskCount: 1, screenFailed: true });
  });

  it("passes when every rating is below the threshold", () => {
    expect(
      screenClientAcceptanceRisks({
        acceptanceThreshold: 5,
        riskRatings: [1, 2, 3, 4],
      }),
    ).toEqual({
      averageRating: 2.5,
      highRiskCount: 0,
      screenFailed: false,
      totalRisks: 4,
    });
  });

  it("rejects an out-of-range rating with its index", () => {
    expect(
      runClientAcceptanceRisk({ acceptanceThreshold: 3, riskRatings: [2, 6] }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_risk_rating", field: "riskRatings.1" }],
      },
      ok: false,
    });
  });
});
