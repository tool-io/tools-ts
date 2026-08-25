import { describe, expect, it } from "vitest";
import { runBrainBodyRatio } from "./tool.js";

describe("Brain-Body Ratio", () => {
  it("calculates a valid result", () =>
    expect(runBrainBodyRatio({ bodyMassKg: 70, brainMassG: 1400 })).toEqual({
      ok: true,
      output: { brainBodyRatio: 20 },
    }));
  it("scales inversely with body mass", () => {
    const result = runBrainBodyRatio({ bodyMassKg: 140, brainMassG: 1400 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.brainBodyRatio).toBe(10);
  });
  it("scales directly with brain mass", () => {
    const result = runBrainBodyRatio({ bodyMassKg: 70, brainMassG: 700 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.brainBodyRatio).toBe(10);
  });
  it("supports small animals", () => {
    const result = runBrainBodyRatio({ bodyMassKg: 0.002, brainMassG: 0.04 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.brainBodyRatio).toBeCloseTo(20, 12);
  });
  it("rejects zero brain mass", () =>
    expect(runBrainBodyRatio({ bodyMassKg: 70, brainMassG: 0 }).ok).toBe(
      false,
    ));
  it("rejects zero body mass", () =>
    expect(runBrainBodyRatio({ bodyMassKg: 0, brainMassG: 1400 }).ok).toBe(
      false,
    ));
  it("rejects negative inputs", () =>
    expect(runBrainBodyRatio({ bodyMassKg: -1, brainMassG: 1400 }).ok).toBe(
      false,
    ));
});
