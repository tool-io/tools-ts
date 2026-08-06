import { describe, expect, it } from "vitest";
import {
  calculateRiskParity,
  riskParityExample,
  runRiskParity,
} from "./tool.js";

describe("Risk-Parity Portfolio", () => {
  it("finds equal risk contributions", () =>
    expect(
      calculateRiskParity(
        [
          [0.04, 0.006],
          [0.006, 0.09],
        ],
        500,
      ),
    ).toEqual({ riskContributions: [0.5, 0.5], weights: [0.6, 0.4] }));
  it("rejects asymmetric covariance", () =>
    expect(
      runRiskParity({
        covariance: [
          [1, 2],
          [0, 1],
        ],
        iterations: 10,
      }).ok,
    ).toBe(false));
  it("publishes an executable example", () =>
    expect(runRiskParity(riskParityExample.input)).toEqual({
      ok: true,
      output: riskParityExample.output,
    }));
});
