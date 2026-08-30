import { describe, expect, it } from "vitest";
import {
  mapSCurveAdoptionPhase,
  runSCurveAdoption,
  sCurveAdoptionExample,
} from "./tool.js";

describe("S-curve adopter phase mapper", () => {
  it("reproduces its canonical example", () => {
    expect(runSCurveAdoption(sCurveAdoptionExample.input)).toEqual({
      ok: true,
      output: sCurveAdoptionExample.output,
    });
  });

  it("assigns cumulative adoption to a custom early-majority phase", () => {
    expect(
      mapSCurveAdoptionPhase({
        categoryCutoffsPercent: [5, 20, 50, 80, 100],
        cumulativeAdoptionPercent: 25,
      }).category,
    ).toBe("earlyMajority");
  });

  it("assigns the innovators phase at zero adoption", () => {
    expect(
      mapSCurveAdoptionPhase({
        categoryCutoffsPercent: [2.5, 13.5, 34, 68, 100],
        cumulativeAdoptionPercent: 0,
      }).categoryIndex,
    ).toBe(0);
  });

  it("requires the final cutoff to be 100", () => {
    expect(
      runSCurveAdoption({
        categoryCutoffsPercent: [2, 10, 30, 60, 90],
        cumulativeAdoptionPercent: 50,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "final_category_cutoff_required",
            field: "categoryCutoffsPercent",
          },
        ],
      },
      ok: false,
    });
  });
});
