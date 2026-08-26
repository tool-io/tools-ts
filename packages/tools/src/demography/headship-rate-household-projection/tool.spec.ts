import { describe, expect, it } from "vitest";
import {
  calculateHeadshipRateHouseholdProjection,
  runHeadshipRateHouseholdProjection,
  headshipRateHouseholdProjectionExample,
} from "./tool.js";

describe("demography/headship-rate-household-projection", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHeadshipRateHouseholdProjection(
        headshipRateHouseholdProjectionExample.input,
      ),
    ).toEqual({
      ok: true,
      output: headshipRateHouseholdProjectionExample.output,
    });
  });

  it("treats a headship rate of one as one household per adult", () => {
    const result = calculateHeadshipRateHouseholdProjection({
      headshipRatesByAge: [1, 1],
      adultPopulationByAge: [250, 750],
    });
    expect(result.projectedHouseholds).toBe(1000);
    expect(result.totalAdultPopulation).toBe(1000);
  });

  it("rejects rates outside zero to one and mismatched lists", () => {
    expect(
      runHeadshipRateHouseholdProjection({
        headshipRatesByAge: [1.2],
        adultPopulationByAge: [100],
      }).ok,
    ).toBe(false);
    expect(
      runHeadshipRateHouseholdProjection({
        headshipRatesByAge: [0.5, 0.3],
        adultPopulationByAge: [100],
      }).ok,
    ).toBe(false);
  });
});
