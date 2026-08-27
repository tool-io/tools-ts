import { describe, expect, it } from "vitest";
import { rockMassRatingRmrExample, runRockMassRatingRmr } from "./tool.js";

describe("rock-mass-rating-rmr", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRockMassRatingRmr(rockMassRatingRmrExample.input)).toEqual({
      ok: true,
      output: rockMassRatingRmrExample.output,
    });
  });

  it("classifies a perfect mass as very good (V)", () => {
    const result = runRockMassRatingRmr({
      uniaxialStrengthRating: 15,
      rockQualityRating: 20,
      jointSpacingRating: 20,
      groundwaterRating: 15,
      jointConditionRating: 30,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rmrTotal as number).toBe(100);
    expect(result.output.rockMassClass as string).toBe("very good (V)");
  });

  it("rejects sub-ratings above their table maxima", () => {
    expect(
      runRockMassRatingRmr({
        uniaxialStrengthRating: 16,
        rockQualityRating: 20,
        jointSpacingRating: 20,
        groundwaterRating: 15,
        jointConditionRating: 30,
      }).ok,
    ).toBe(false);
  });
});
