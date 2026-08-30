import { describe, expect, it } from "vitest";
import {
  assessNonattestServiceThreat,
  nonattestServiceExample,
  runNonattestService,
} from "./tool.js";

describe("nonattest service management threat checker", () => {
  it("reproduces its canonical example", () => {
    expect(runNonattestService(nonattestServiceExample.input)).toEqual({
      ok: true,
      output: nonattestServiceExample.output,
    });
  });

  it("accepts two supplied safeguards with all governance facts", () => {
    expect(
      assessNonattestServiceThreat({
        auditorReportsPolicy: true,
        managementDesignatesDecisionMaker: true,
        safeguardCount: 3,
        servicePreapproved: true,
        serviceType: "Implementation",
      }).managementResponsibilityThreatReduced,
    ).toBe(true);
  });

  it("flags fewer than two safeguards", () => {
    expect(
      assessNonattestServiceThreat({
        auditorReportsPolicy: true,
        managementDesignatesDecisionMaker: true,
        safeguardCount: 1,
        servicePreapproved: true,
        serviceType: "Implementation",
      }).missingSafeguards,
    ).toEqual(["fewer_than_two_safeguards"]);
  });

  it("rejects a blank service type", () => {
    expect(
      runNonattestService({
        auditorReportsPolicy: true,
        managementDesignatesDecisionMaker: true,
        safeguardCount: 2,
        servicePreapproved: true,
        serviceType: " ",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "service_type_required", field: "serviceType" }],
      },
      ok: false,
    });
  });
});
