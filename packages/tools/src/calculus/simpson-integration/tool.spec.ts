import { describe, expect, it } from "vitest";
import {
  simpsonIntegrationExample,
  calculateSimpsonIntegration,
  runSimpsonIntegration,
} from "./tool.js";

describe("calculus/simpson-integration", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSimpsonIntegration(simpsonIntegrationExample.input)).toEqual({
      ok: true,
      output: simpsonIntegrationExample.output,
    });
  });
  it("rejects invalid input (invalid_sample_count)", () => {
    expect(
      runSimpsonIntegration({ values: [1, 2, 3, 4], xMin: 0, xMax: 3 }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (invalid_interval)", () => {
    expect(
      runSimpsonIntegration({ values: [1, 2, 3], xMin: 2, xMax: 2 }).ok,
    ).toBe(false);
  });
  it("integrates a linear function exactly", () => {
    const result = runSimpsonIntegration({
      values: [0, 2, 4],
      xMin: 0,
      xMax: 4,
    });
    expect(result.ok && result.output.integral === 8).toBe(true);
  });
});
