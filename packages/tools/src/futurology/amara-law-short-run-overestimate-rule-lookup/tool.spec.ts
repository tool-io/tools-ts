import { describe, expect, it } from "vitest";
import {
  amaraLawExample,
  calculateAmaraLawOverstatement,
  runAmaraLaw,
} from "./tool.js";

describe("Amara law short-run overestimate comparison", () => {
  it("reproduces its canonical example", () => {
    expect(runAmaraLaw(amaraLawExample.input)).toEqual({
      ok: true,
      output: amaraLawExample.output,
    });
  });

  it("reports no overstatement for an exact prediction", () => {
    expect(
      calculateAmaraLawOverstatement({
        longTermOutcome: 25,
        shortTermPrediction: 25,
      }),
    ).toEqual({
      overestimated: false,
      overstatementPercent: 0,
      predictionToOutcomeRatio: 1,
    });
  });

  it("reports underestimation as a negative percentage", () => {
    expect(
      calculateAmaraLawOverstatement({
        longTermOutcome: 50,
        shortTermPrediction: 25,
      }).overstatementPercent,
    ).toBe(-50);
  });

  it("rejects a nonpositive long-term outcome", () => {
    expect(
      runAmaraLaw({ longTermOutcome: 0, shortTermPrediction: 10 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_long_term_outcome", field: "longTermOutcome" },
        ],
      },
      ok: false,
    });
  });
});
