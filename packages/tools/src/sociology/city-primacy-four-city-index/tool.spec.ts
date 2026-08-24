import { describe, expect, it } from "vitest";
import {
  calculateFourCityPrimacy,
  cityPrimacyFourCityIndexExample,
  cityPrimacyFourCityIndexTool,
  runCityPrimacyFourCityIndex,
} from "./tool.js";

describe("cityPrimacyFourCityIndexTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runCityPrimacyFourCityIndex(cityPrimacyFourCityIndexExample.input),
    ).toEqual({
      ok: true,
      output: cityPrimacyFourCityIndexExample.output,
    });
  });

  it("uses P1 divided by P2 plus P3 plus P4 and enforces rank order", () => {
    expect(
      calculateFourCityPrimacy({
        fourthCityPopulation: 100,
        largestCityPopulation: 900,
        secondCityPopulation: 400,
        thirdCityPopulation: 200,
      }),
    ).toEqual({ fourCityPrimacyIndex: 900 / 700 });
    const result = runCityPrimacyFourCityIndex({
      fourthCityPopulation: 100,
      largestCityPopulation: 900,
      secondCityPopulation: 200,
      thirdCityPopulation: 300,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].code).toBe("invalid_rank_order");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(cityPrimacyFourCityIndexExample))).toEqual(
      cityPrimacyFourCityIndexExample,
    );
    expect(cityPrimacyFourCityIndexTool.contractVersion).toBe(1);
    expect(cityPrimacyFourCityIndexTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCityPrimacyFourCityIndex(null).ok).toBe(false);
    expect(
      runCityPrimacyFourCityIndex({
        ...cityPrimacyFourCityIndexExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
