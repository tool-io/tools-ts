import { describe, expect, it } from "vitest";
import {
  mapThreeHorizonItems,
  runThreeHorizons,
  threeHorizonsExample,
} from "./tool.js";

describe("three horizons transition map", () => {
  it("reproduces its canonical example", () => {
    expect(runThreeHorizons(threeHorizonsExample.input)).toEqual({
      ok: true,
      output: threeHorizonsExample.output,
    });
  });

  it("puts boundary years in the later horizon", () => {
    expect(
      mapThreeHorizonItems({
        itemYears: [2030, 2040],
        secondHorizonStart: 2030,
        thirdHorizonStart: 2040,
      }).horizonCounts,
    ).toEqual([0, 1, 1]);
  });

  it("maps all items to the first horizon before the boundary", () => {
    expect(
      mapThreeHorizonItems({
        itemYears: [2020, 2029],
        secondHorizonStart: 2030,
        thirdHorizonStart: 2040,
      }).horizonCounts,
    ).toEqual([2, 0, 0]);
  });

  it("rejects reversed horizon boundaries", () => {
    expect(
      runThreeHorizons({
        itemYears: [],
        secondHorizonStart: 2040,
        thirdHorizonStart: 2030,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_horizon_boundaries", field: "thirdHorizonStart" },
        ],
      },
      ok: false,
    });
  });
});
