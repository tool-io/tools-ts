import { describe, expect, it } from "vitest";
import {
  calculateChiSquareGoodnessOfFit,
  chiSquareGoodnessOfFitExample,
  runChiSquareGoodnessOfFit,
} from "./tool.js";

describe("chi-square goodness-of-fit calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runChiSquareGoodnessOfFit(chiSquareGoodnessOfFitExample.input),
    ).toEqual({ ok: true, output: chiSquareGoodnessOfFitExample.output });
  });

  it("returns a perfect fit for explicit matching probabilities", () => {
    const output = calculateChiSquareGoodnessOfFit({
      expectedProbabilities: [0.2, 0.3, 0.5],
      observed: [20, 30, 50],
    });
    expect(output).toMatchObject({
      chiSquare: 0,
      degreesOfFreedom: 2,
      pValue: 1,
      significant: false,
    });
  });

  it("rejects a strongly deviating uniform sample", () => {
    const output = calculateChiSquareGoodnessOfFit({
      observed: [100, 0],
    });
    expect(output.chiSquare).toBe(100);
    expect(output.degreesOfFreedom).toBe(1);
    expect(output.pValue).toBeLessThan(0.000001);
    expect(output.significant).toBe(true);
  });

  it("honors the significance level boundary", () => {
    // Uniform expectation gives chi-square 16 here and p is about 6.3e-5,
    // so the decision flips between a 0.001% and a 0.01% level.
    const strict = calculateChiSquareGoodnessOfFit({
      observed: [70, 30],
      significanceLevel: 0.00001,
    });
    expect(strict.significant).toBe(false);
    const relaxed = calculateChiSquareGoodnessOfFit({
      observed: [70, 30],
      significanceLevel: 0.001,
    });
    expect(relaxed.significant).toBe(true);
  });

  it("validates counts and probabilities through execution", () => {
    expect(
      runChiSquareGoodnessOfFit({ observed: [5] }),
    ).toMatchObject({
      error: { issues: [{ code: "insufficient_categories" }] },
      ok: false,
    });
    expect(
      runChiSquareGoodnessOfFit({ observed: [5, -1] }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_observed_counts" }] },
      ok: false,
    });
    expect(
      runChiSquareGoodnessOfFit({ observed: [0, 0] }),
    ).toMatchObject({
      error: { issues: [{ code: "empty_observed_counts" }] },
      ok: false,
    });
    expect(
      runChiSquareGoodnessOfFit({
        expectedProbabilities: [0.5, 0.2],
        observed: [5, 5],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_probability_sum" }] },
      ok: false,
    });
    expect(
      runChiSquareGoodnessOfFit({
        expectedProbabilities: [0.5, 0.5, 0.5],
        observed: [5, 5],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "probability_length_mismatch" }] },
      ok: false,
    });
  });
});
