import { describe, expect, it } from "vitest";
import {
  abcAnalysisCumulativeValueClassifierExample,
  calculateAbcAnalysisCumulativeValueClassifier,
  runAbcAnalysisCumulativeValueClassifier,
} from "./tool.js";

describe("abc-analysis-cumulative-value-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAbcAnalysisCumulativeValueClassifier(
        abcAnalysisCumulativeValueClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: abcAnalysisCumulativeValueClassifierExample.output,
    });
  });

  it("applies the fixed thresholds inclusively to the lower class", () => {
    expect(
      calculateAbcAnalysisCumulativeValueClassifier({
        cumulativeValueSharePercent: 0,
      }),
    ).toEqual({ abcClass: "A" });
    expect(
      calculateAbcAnalysisCumulativeValueClassifier({
        cumulativeValueSharePercent: 80,
      }),
    ).toEqual({ abcClass: "A" });
    expect(
      calculateAbcAnalysisCumulativeValueClassifier({
        cumulativeValueSharePercent: 80.0001,
      }),
    ).toEqual({ abcClass: "B" });
    expect(
      calculateAbcAnalysisCumulativeValueClassifier({
        cumulativeValueSharePercent: 95,
      }),
    ).toEqual({ abcClass: "B" });
    expect(
      calculateAbcAnalysisCumulativeValueClassifier({
        cumulativeValueSharePercent: 95.0001,
      }),
    ).toEqual({ abcClass: "C" });
    expect(
      calculateAbcAnalysisCumulativeValueClassifier({
        cumulativeValueSharePercent: 100,
      }),
    ).toEqual({ abcClass: "C" });
  });

  it.each([-1, 100.0001, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects an invalid cumulative share of %s through direct calculation",
    (cumulativeValueSharePercent) => {
      expect(() =>
        calculateAbcAnalysisCumulativeValueClassifier({
          cumulativeValueSharePercent,
        }),
      ).toThrow("Cumulative value share must be between zero and one hundred.");
    },
  );

  it("reports the public input field for an out-of-range share", () => {
    const result = runAbcAnalysisCumulativeValueClassifier({
      cumulativeValueSharePercent: 120,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected validation failure");
    expect(result.error.issues).toEqual([
      {
        code: "invalid_field",
        field: "cumulativeValueSharePercent",
        message: "Cumulative value share is invalid.",
      },
    ]);
  });
});
