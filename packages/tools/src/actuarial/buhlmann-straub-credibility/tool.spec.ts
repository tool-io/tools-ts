import { describe, expect, it } from "vitest";
import {
  buhlmannStraubCredibilityExample,
  calculateBuhlmannStraubCredibility,
  runBuhlmannStraubCredibility,
} from "./tool.js";

describe("Buhlmann-Straub Credibility Factor Calculator", () => {
  it("reproduces its canonical example", () => {
    expect(
      runBuhlmannStraubCredibility(buhlmannStraubCredibilityExample.input),
    ).toEqual({
      ok: true,
      output: buhlmannStraubCredibilityExample.output,
    });
  });

  it("uses total exposure and EPV over VHM", () => {
    expect(
      calculateBuhlmannStraubCredibility({
        exposureUnits: 100,
        processVariance: 200,
        varianceOfHypotheticalMeans: 4,
      }),
    ).toEqual({ credibilityFactor: 2 / 3 });
  });

  it("handles zero exposure and zero process variance", () => {
    expect(
      calculateBuhlmannStraubCredibility({
        exposureUnits: 0,
        processVariance: 0,
        varianceOfHypotheticalMeans: 2,
      }),
    ).toEqual({ credibilityFactor: 0 });
    expect(
      calculateBuhlmannStraubCredibility({
        exposureUnits: 10,
        processVariance: 0,
        varianceOfHypotheticalMeans: 2,
      }),
    ).toEqual({ credibilityFactor: 1 });
  });

  it("rejects negative components and nonpositive VHM", () => {
    expect(
      runBuhlmannStraubCredibility({
        exposureUnits: -1,
        processVariance: 50,
        varianceOfHypotheticalMeans: 2,
      }).ok,
    ).toBe(false);
    expect(
      runBuhlmannStraubCredibility({
        exposureUnits: 10,
        processVariance: 50,
        varianceOfHypotheticalMeans: 0,
      }).ok,
    ).toBe(false);
  });
});
