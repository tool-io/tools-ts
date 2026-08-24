import { describe, expect, it } from "vitest";
import {
  trapezoidalIntegrationExample,
  calculateTrapezoidalIntegration,
  runTrapezoidalIntegration,
} from "./tool.js";

describe("calculus/trapezoidal-integration", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTrapezoidalIntegration(trapezoidalIntegrationExample.input),
    ).toEqual({
      ok: true,
      output: trapezoidalIntegrationExample.output,
    });
  });
  it("rejects invalid input (invalid_sample_count)", () => {
    expect(
      runTrapezoidalIntegration({ values: [7], xMin: 0, xMax: 1 }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (invalid_interval)", () => {
    expect(
      runTrapezoidalIntegration({ values: [1, 2], xMin: 3, xMax: 1 }).ok,
    ).toBe(false);
  });
});
