import { describe, expect, it } from "vitest";
import { seismicEnergyExample, runSeismicEnergy } from "./tool.js";

describe("seismic-energy", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSeismicEnergy(seismicEnergyExample.input)).toEqual({
      ok: true,
      output: seismicEnergyExample.output,
    });
  });

  it("gives about 31.6 times more energy per magnitude unit", () => {
    const small = runSeismicEnergy({ magnitude: 5 });
    const large = runSeismicEnergy({ magnitude: 6 });
    if (!small.ok || !large.ok) throw new Error("expected success");
    expect(
      (large.output.energyJoules as number) /
        (small.output.energyJoules as number),
    ).toBeCloseTo(Math.pow(10, 1.5), 12);
  });
  it("rejects non-finite magnitudes", () => {
    expect(runSeismicEnergy({ magnitude: Number.NaN }).ok).toBe(false);
  });
});
