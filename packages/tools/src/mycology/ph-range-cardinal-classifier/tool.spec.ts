import { describe, expect, it } from "vitest";
import {
  phPreferenceClassifierExample,
  phPreferenceClassifierTool,
  runPhPreferenceClassifier,
} from "./tool.js";

describe("pH Preference Classifier", () => {
  const boundaries = {
    acidophilicMaximumPh: 4,
    acidotolerantMaximumPh: 6,
    neutrophilicMaximumPh: 8,
  };
  it("executes its canonical example to the exact published output", () => {
    expect(
      runPhPreferenceClassifier(phPreferenceClassifierExample.input),
    ).toEqual({
      ok: true,
      output: phPreferenceClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(phPreferenceClassifierExample))).toEqual(
      phPreferenceClassifierExample,
    );
    expect(phPreferenceClassifierTool.contractVersion).toBe(1);
    expect(phPreferenceClassifierTool.execution).toEqual({ kind: "pure" });
  });

  it("classes strongly acidic optima as acidophilic", () => {
    const result = runPhPreferenceClassifier({ ...boundaries, optimalPh: 3 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.phPreferenceClass).toBe("acidophilic");
  });

  it("classes mildly acidic optima as acidotolerant and near-neutral as neutrophilic", () => {
    expect(
      runPhPreferenceClassifier({ ...boundaries, optimalPh: 6 }).ok === true &&
        runPhPreferenceClassifier({ ...boundaries, optimalPh: 4 }).ok,
    ).toBe(true);
    const moderate = runPhPreferenceClassifier({ ...boundaries, optimalPh: 6 });
    if (moderate.ok)
      expect(moderate.output.phPreferenceClass).toBe("acidotolerant");
    const neutral = runPhPreferenceClassifier({
      ...boundaries,
      optimalPh: 7.9,
    });
    if (neutral.ok)
      expect(neutral.output.phPreferenceClass).toBe("neutrophilic");
  });

  it("classes alkaline optima as alkaliphilic including the boundary", () => {
    const result = runPhPreferenceClassifier({ ...boundaries, optimalPh: 14 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.phPreferenceClass).toBe("alkaliphilic");
    const at8 = runPhPreferenceClassifier({ ...boundaries, optimalPh: 8 });
    if (at8.ok) expect(at8.output.phPreferenceClass).toBe("neutrophilic");
  });

  it("rejects pH values outside the 0-14 scale", () => {
    expect(
      runPhPreferenceClassifier({ ...boundaries, optimalPh: -0.1 }).ok,
    ).toBe(false);
    expect(
      runPhPreferenceClassifier({ ...boundaries, optimalPh: 14.1 }).ok,
    ).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runPhPreferenceClassifier(null).ok).toBe(false);
    expect(
      runPhPreferenceClassifier({ ...boundaries, optimalPh: "7" }).ok,
    ).toBe(false);
    expect(
      runPhPreferenceClassifier({
        ...phPreferenceClassifierExample.input,
        zone: 1,
      }).ok,
    ).toBe(false);
  });
  it("rejects unordered boundaries", () =>
    expect(
      runPhPreferenceClassifier({
        acidophilicMaximumPh: 6,
        acidotolerantMaximumPh: 5,
        neutrophilicMaximumPh: 8,
        optimalPh: 7,
      }).ok,
    ).toBe(false));
});
