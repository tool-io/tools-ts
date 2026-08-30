import { describe, expect, it } from "vitest";
import {
  evaluatePartnerRotationTimeOut,
  partnerRotationExample,
  runPartnerRotation,
} from "./tool.js";

describe("partner rotation time-out period", () => {
  it("reproduces its canonical example", () => {
    expect(runPartnerRotation(partnerRotationExample.input)).toEqual({
      ok: true,
      output: partnerRotationExample.output,
    });
  });

  it("accepts the exact calendar anniversary", () => {
    expect(
      evaluatePartnerRotationTimeOut({
        currentDate: "2026-01-01",
        rotationOffDate: "2019-01-01",
        requiredTimeOutYears: 7,
      }),
    ).toMatchObject({ compliant: true, elapsedCompleteYears: 7 });
  });

  it("handles a leap-day anniversary without mean-year arithmetic", () => {
    expect(
      evaluatePartnerRotationTimeOut({
        currentDate: "2025-02-28",
        rotationOffDate: "2024-02-29",
        requiredTimeOutYears: 1,
      }),
    ).toMatchObject({ compliant: true, eligibleDate: "2025-02-28" });
  });

  it("rejects a rotation-off date after the current date", () => {
    expect(
      runPartnerRotation({
        currentDate: "2026-01-01",
        rotationOffDate: "2026-01-02",
        requiredTimeOutYears: 7,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_rotation_date", field: "rotationOffDate" }],
      },
      ok: false,
    });
  });
});
