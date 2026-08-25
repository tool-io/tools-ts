import { describe, expect, it } from "vitest";
import {
  brett4epRiskCheckerExample,
  brett4epRiskCheckerTool,
  runBrett4epRiskChecker,
} from "./tool.js";

describe("brett4epRiskCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runBrett4epRiskChecker(brett4epRiskCheckerExample.input)).toEqual({
      ok: true,
      output: brett4epRiskCheckerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(brett4epRiskCheckerExample))).toEqual(
      brett4epRiskCheckerExample,
    );
    expect(brett4epRiskCheckerTool.contractVersion).toBe(1);
    expect(brett4epRiskCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runBrett4epRiskChecker(null).ok).toBe(false);
    expect(
      runBrett4epRiskChecker({
        ...brett4epRiskCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("uses caller-supplied sensory thresholds", () => {
    expect(
      runBrett4epRiskChecker({
        fourEpUgL: 300,
        highThresholdUgL: 400,
        noticeableThresholdUgL: 250,
      }),
    ).toEqual({ ok: true, output: { riskLevel: "noticeable" } });
  });
});
