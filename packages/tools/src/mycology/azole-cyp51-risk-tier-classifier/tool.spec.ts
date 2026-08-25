import { describe, expect, it } from "vitest";
import {
  azoleRiskTierClassifierExample,
  azoleRiskTierClassifierTool,
  runAzoleRiskTierClassifier,
} from "./tool.js";

describe("CYP51 Azole Resistance Evidence Classifier", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runAzoleRiskTierClassifier(azoleRiskTierClassifierExample.input),
    ).toEqual({
      ok: true,
      output: azoleRiskTierClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(azoleRiskTierClassifierExample))).toEqual(
      azoleRiskTierClassifierExample,
    );
    expect(azoleRiskTierClassifierTool.contractVersion).toBe(1);
    expect(azoleRiskTierClassifierTool.execution).toEqual({ kind: "pure" });
  });

  it("does not claim susceptibility when no evidence is reported", () => {
    const result = runAzoleRiskTierClassifier({
      knownResistanceVariantDetected: false,
      phenotypicAzoleResistanceDetected: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.cyp51RiskTier).toBe("no-resistance-marker-reported");
  });

  it("prioritizes reported phenotypic resistance", () => {
    const result = runAzoleRiskTierClassifier({
      knownResistanceVariantDetected: false,
      phenotypicAzoleResistanceDetected: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.cyp51RiskTier).toBe(
        "phenotypic-resistance-detected",
      );
  });

  it("returns structured errors for malformed input", () => {
    expect(runAzoleRiskTierClassifier(null).ok).toBe(false);
    expect(
      runAzoleRiskTierClassifier({
        knownResistanceVariantDetected: "yes",
        phenotypicAzoleResistanceDetected: false,
      }).ok,
    ).toBe(false);
  });
});
