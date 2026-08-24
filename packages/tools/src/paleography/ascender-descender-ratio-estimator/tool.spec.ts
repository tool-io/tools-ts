import { describe, expect, it } from "vitest";
import {
  ascenderDescenderRatioEstimatorExample,
  runAscenderDescenderRatioEstimator,
} from "./tool.js";

describe("ascender-descender-ratio-estimator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAscenderDescenderRatioEstimator(
        ascenderDescenderRatioEstimatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: ascenderDescenderRatioEstimatorExample.output,
    });
  });

  it("bands a long-descender cursive as descender-dominant", () => {
    const result = runAscenderDescenderRatioEstimator({
      meanAscenderHeightMm: 2,
      meanDescenderHeightMm: 3,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.profileBand).toBe("descender_dominant");
  });

  it("rejects zero heights", () => {
    expect(
      runAscenderDescenderRatioEstimator({
        meanAscenderHeightMm: 3,
        meanDescenderHeightMm: 0,
      }).ok,
    ).toBe(false);
  });
});
