import { describe, expect, it } from "vitest";
import {
  calculateExpectedDeviationInputs,
  expectedDeviationExample,
  runExpectedDeviation,
} from "./tool.js";

describe("tolerable and expected deviation inputs", () => {
  it("reproduces its canonical example", () => {
    expect(runExpectedDeviation(expectedDeviationExample.input)).toEqual({
      ok: true,
      output: expectedDeviationExample.output,
    });
  });

  it("allows a negative rate headroom when expectation exceeds tolerance", () => {
    expect(
      calculateExpectedDeviationInputs({
        expectedDeviationRatePercent: 8,
        populationSize: 50,
        tolerableDeviationRatePercent: 5,
      }),
    ).toEqual({
      expectedDeviations: 4,
      rateHeadroomPercent: -3,
      tolerableDeviationCount: 2.5,
    });
  });

  it("returns zero counts at zero rates", () => {
    expect(
      calculateExpectedDeviationInputs({
        expectedDeviationRatePercent: 0,
        populationSize: 100,
        tolerableDeviationRatePercent: 0,
      }),
    ).toMatchObject({ expectedDeviations: 0, tolerableDeviationCount: 0 });
  });

  it("rejects a zero population", () => {
    expect(
      runExpectedDeviation({
        expectedDeviationRatePercent: 1,
        populationSize: 0,
        tolerableDeviationRatePercent: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "populationSize" }],
      },
      ok: false,
    });
  });
});
