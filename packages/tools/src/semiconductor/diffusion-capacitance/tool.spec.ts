import { describe, expect, it } from "vitest";
import { calculateDiffusionCapacitance, diffusionCapacitanceExample, runDiffusionCapacitance } from "./tool.js";

describe("diffusion capacitance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDiffusionCapacitance(diffusionCapacitanceExample.input)).toEqual({
      ok: true,
      output: diffusionCapacitanceExample.output,
    });
  });

  it("scales linearly with current and lifetime", () => {
    const base = calculateDiffusionCapacitance({ forwardCurrentMa: 1, idealityFactor: 1, lifetimeNs: 100 }).capacitanceNanoF;
    const doubledCurrent = calculateDiffusionCapacitance({ forwardCurrentMa: 2, idealityFactor: 1, lifetimeNs: 100 }).capacitanceNanoF;
    const doubledLifetime = calculateDiffusionCapacitance({ forwardCurrentMa: 1, idealityFactor: 1, lifetimeNs: 200 }).capacitanceNanoF;
    expect(doubledCurrent).toBeCloseTo(base * 2, 9);
    expect(doubledLifetime).toBeCloseTo(base * 2, 9);
  });

  it("rejects sub-unity ideality through execution", () => {
    expect(runDiffusionCapacitance({ forwardCurrentMa: 1, idealityFactor: 0.5, lifetimeNs: 100 }).ok).toBe(false);
  });
});
