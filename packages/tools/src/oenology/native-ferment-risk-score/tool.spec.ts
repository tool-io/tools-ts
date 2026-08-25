import { describe, expect, it } from "vitest";
import {
  nativeFermentRiskScoreExample,
  nativeFermentRiskScoreTool,
  runNativeFermentRiskScore,
} from "./tool.js";

describe("nativeFermentRiskScoreTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runNativeFermentRiskScore(nativeFermentRiskScoreExample.input),
    ).toEqual({
      ok: true,
      output: nativeFermentRiskScoreExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(nativeFermentRiskScoreExample))).toEqual(
      nativeFermentRiskScoreExample,
    );
    expect(nativeFermentRiskScoreTool.contractVersion).toBe(1);
    expect(nativeFermentRiskScoreTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runNativeFermentRiskScore(null).ok).toBe(false);
    expect(
      runNativeFermentRiskScore({
        ...nativeFermentRiskScoreExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});

describe("native ferment risk score boundaries", () => {
  const model = {
    highRiskThreshold: 50,
    moderateRiskThreshold: 20,
    so2BaselineMgPerL: 10,
    temperatureBaselineC: 15,
    temperatureWeightPerDegree: 2,
  };

  it("scores clean warm musts as low risk", () => {
    const result = runNativeFermentRiskScore({
      ...model,
      freeSo2AtCrushMgPerL: 0,
      mustTemperatureC: 20,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.riskLevel).toBe("low");
      expect(result.output.riskScore).toBe(0);
    }
  });

  it("flags chilled high-sulfur musts as moderate risk", () => {
    const result = runNativeFermentRiskScore({
      ...model,
      freeSo2AtCrushMgPerL: 30,
      mustTemperatureC: 12,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.riskLevel).toBe("moderate");
      expect(result.output.riskScore).toBe(26);
    }
  });
});
