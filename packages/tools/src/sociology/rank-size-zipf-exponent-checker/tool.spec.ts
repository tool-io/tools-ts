import { describe, expect, it } from "vitest";
import {
  calculateRankSizeZipf,
  rankSizeZipfExponentCheckerExample,
  rankSizeZipfExponentCheckerTool,
  runRankSizeZipfExponentChecker,
} from "./tool.js";

describe("rankSizeZipfExponentCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runRankSizeZipfExponentChecker(rankSizeZipfExponentCheckerExample.input),
    ).toEqual({
      ok: true,
      output: rankSizeZipfExponentCheckerExample.output,
    });
  });

  it("matches the classical inverse-rank population at exponent one", () => {
    expect(
      calculateRankSizeZipf({
        cityPopulation: 250,
        cityRank: 4,
        largestCityPopulation: 1000,
        zipfExponent: 1,
      }),
    ).toEqual({ deviationPercent: 0, withinZipfTolerance: true });
    const result = runRankSizeZipfExponentChecker({
      cityPopulation: 1,
      cityRank: 2,
      largestCityPopulation: 0,
      zipfExponent: 1,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("largestCityPopulation");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(rankSizeZipfExponentCheckerExample)),
    ).toEqual(rankSizeZipfExponentCheckerExample);
    expect(rankSizeZipfExponentCheckerTool.contractVersion).toBe(1);
    expect(rankSizeZipfExponentCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runRankSizeZipfExponentChecker(null).ok).toBe(false);
    expect(
      runRankSizeZipfExponentChecker({
        ...rankSizeZipfExponentCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
