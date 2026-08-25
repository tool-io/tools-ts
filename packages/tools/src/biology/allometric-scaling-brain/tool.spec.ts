import { describe, expect, it } from "vitest";
import { runAllometricScalingBrain } from "./tool.js";

describe("Brain Allometry Slope", () => {
  it("calculates the default scaling line", () =>
    expect(runAllometricScalingBrain({ bodyMassG: 1000 })).toEqual({
      ok: true,
      output: { predictedBrainMassG: 17.78279410038923 },
    }));
  it("reproduces the default with explicit parameters", () => {
    const implicit = runAllometricScalingBrain({ bodyMassG: 1000 });
    const explicit = runAllometricScalingBrain({
      bodyMassG: 1000,
      intercept: -1,
      slope: 0.75,
    });
    expect(explicit).toEqual(implicit);
  });
  it("predicts ten to the intercept at one gram", () => {
    const result = runAllometricScalingBrain({ bodyMassG: 1 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.predictedBrainMassG).toBeCloseTo(0.1, 12);
  });
  it("scales by slope when mass doubles", () => {
    const small = runAllometricScalingBrain({ bodyMassG: 1000 });
    const large = runAllometricScalingBrain({ bodyMassG: 2000 });
    expect(small.ok && large.ok).toBe(true);
    if (small.ok && large.ok)
      expect(
        Number(large.output.predictedBrainMassG) /
          Number(small.output.predictedBrainMassG),
      ).toBeCloseTo(Math.pow(2, 0.75), 12);
  });
  it("follows a custom linear slope of one", () => {
    const result = runAllometricScalingBrain({
      bodyMassG: 500,
      intercept: -1,
      slope: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.predictedBrainMassG).toBeCloseTo(50, 12);
  });
  it("stays positive for tiny masses", () => {
    const result = runAllometricScalingBrain({ bodyMassG: 0.001 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.predictedBrainMassG).toBeGreaterThan(0);
  });
  it("rejects zero body mass", () =>
    expect(runAllometricScalingBrain({ bodyMassG: 0 }).ok).toBe(false));
  it("rejects negative body mass", () =>
    expect(runAllometricScalingBrain({ bodyMassG: -70 }).ok).toBe(false));
});
