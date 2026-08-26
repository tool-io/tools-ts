import { describe, expect, it } from "vitest";
import { runHemoglobinA1cEstimatedAverageGlucose } from "./tool.js";

describe("eAG From A1c", () => {
  it("converts an A1c of six with the ADAG regression", () =>
    expect(
      runHemoglobinA1cEstimatedAverageGlucose({ hba1cPercent: 6 }),
    ).toEqual({
      ok: true,
      output: { estimatedAverageGlucoseMgDl: 125.49999999999999 },
    }));
  it("converts a diabetic A1c of nine", () =>
    expect(
      runHemoglobinA1cEstimatedAverageGlucose({ hba1cPercent: 9 }),
    ).toEqual({
      ok: true,
      output: { estimatedAverageGlucoseMgDl: 211.60000000000002 },
    }));
  it("converts the prediabetes threshold A1c of 5.7", () =>
    expect(
      runHemoglobinA1cEstimatedAverageGlucose({ hba1cPercent: 5.7 }),
    ).toEqual({
      ok: true,
      output: { estimatedAverageGlucoseMgDl: 116.89 },
    }));
  it("keeps low but supported A1c values positive", () =>
    expect(
      runHemoglobinA1cEstimatedAverageGlucose({ hba1cPercent: 3 }),
    ).toEqual({
      ok: true,
      output: { estimatedAverageGlucoseMgDl: 39.39999999999999 },
    }));
  it("supports the upper bound of the range", () =>
    expect(
      runHemoglobinA1cEstimatedAverageGlucose({ hba1cPercent: 20 }),
    ).toEqual({
      ok: true,
      output: { estimatedAverageGlucoseMgDl: 527.3 },
    }));
  it("rejects A1c below three", () => {
    const result = runHemoglobinA1cEstimatedAverageGlucose({
      hba1cPercent: 2.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects A1c above twenty", () => {
    const result = runHemoglobinA1cEstimatedAverageGlucose({
      hba1cPercent: 20.1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("hba1cPercent");
  });
});
