import { describe, expect, it } from "vitest";
import {
  calculateOvercrowdingRate,
  overcrowdedDwellingRateEurostatExample,
  overcrowdedDwellingRateEurostatTool,
  runOvercrowdedDwellingRateEurostat,
} from "./tool.js";

describe("overcrowdedDwellingRateEurostatTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runOvercrowdedDwellingRateEurostat(
        overcrowdedDwellingRateEurostatExample.input,
      ),
    ).toEqual({
      ok: true,
      output: overcrowdedDwellingRateEurostatExample.output,
    });
  });

  it("uses people, not dwellings, in Eurostat's overcrowding-rate denominator", () => {
    expect(
      calculateOvercrowdingRate({
        peopleInOvercrowdedHouseholds: 25,
        surveyedPopulation: 200,
      }),
    ).toEqual({ overcrowdingRatePercent: 12.5 });
    const result = runOvercrowdedDwellingRateEurostat({
      peopleInOvercrowdedHouseholds: 201,
      surveyedPopulation: 200,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("peopleInOvercrowdedHouseholds");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(overcrowdedDwellingRateEurostatExample)),
    ).toEqual(overcrowdedDwellingRateEurostatExample);
    expect(overcrowdedDwellingRateEurostatTool.contractVersion).toBe(1);
    expect(overcrowdedDwellingRateEurostatTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runOvercrowdedDwellingRateEurostat(null).ok).toBe(false);
    expect(
      runOvercrowdedDwellingRateEurostat({
        ...overcrowdedDwellingRateEurostatExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
