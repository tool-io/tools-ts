import { describe, expect, it } from "vitest";
import { photonLifetimeExample, runPhotonLifetime } from "./tool.js";

describe("Photon Lifetime Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPhotonLifetime(photonLifetimeExample.input)).toEqual({
      ok: true,
      output: photonLifetimeExample.output,
    });
  });

  it("uses the exact speed of light conversion in centimetres per picosecond", () => {
    const result = runPhotonLifetime({
      refractiveIndex: 3.5,
      totalLossPerCm: 100,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.lifetimePs).toBeCloseTo(
        3.5 / (0.0299792458 * 100),
        15,
      );
  });

  it("halves lifetime when distributed loss doubles", () => {
    const low = runPhotonLifetime({ refractiveIndex: 3, totalLossPerCm: 50 });
    const high = runPhotonLifetime({ refractiveIndex: 3, totalLossPerCm: 100 });
    expect(low.ok && high.ok).toBe(true);
    if (low.ok && high.ok)
      expect(high.output.lifetimePs).toBe(low.output.lifetimePs / 2);
  });

  it("rejects non-positive refractive index or loss", () => {
    expect(
      runPhotonLifetime({ refractiveIndex: 0, totalLossPerCm: 100 }).ok,
    ).toBe(false);
    expect(
      runPhotonLifetime({ refractiveIndex: 3, totalLossPerCm: 0 }).ok,
    ).toBe(false);
  });
});
