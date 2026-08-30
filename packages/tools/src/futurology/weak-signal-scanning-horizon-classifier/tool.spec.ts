import { describe, expect, it } from "vitest";
import {
  classifyWeakSignalHorizons,
  runWeakSignalHorizon,
  weakSignalHorizonExample,
} from "./tool.js";

describe("weak signal scanning horizon classifier", () => {
  it("reproduces its canonical example", () => {
    expect(runWeakSignalHorizon(weakSignalHorizonExample.input)).toEqual({
      ok: true,
      output: weakSignalHorizonExample.output,
    });
  });

  it("places boundary years in the earlier horizon", () => {
    expect(
      classifyWeakSignalHorizons({
        mediumHorizonEndYears: 10,
        nearHorizonEndYears: 3,
        signalHorizonYears: [3, 10],
        signalIds: ["A", "B"],
      }).horizonCounts,
    ).toEqual([1, 1, 0]);
  });

  it("places later signals in the far horizon", () => {
    expect(
      classifyWeakSignalHorizons({
        mediumHorizonEndYears: 5,
        nearHorizonEndYears: 2,
        signalHorizonYears: [6],
        signalIds: ["Long"],
      }).assignments,
    ).toEqual(["Long: H3"]);
  });

  it("rejects reversed horizon boundaries", () => {
    expect(
      runWeakSignalHorizon({
        mediumHorizonEndYears: 2,
        nearHorizonEndYears: 5,
        signalHorizonYears: [],
        signalIds: [],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_horizon_boundaries",
            field: "mediumHorizonEndYears",
          },
        ],
      },
      ok: false,
    });
  });
});
