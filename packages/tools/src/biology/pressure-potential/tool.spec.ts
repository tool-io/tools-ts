import { describe, expect, it } from "vitest";
import { pressurePotentialExample, runPressurePotential } from "./tool.js";

describe("Pressure Potential", () => {
  it("publishes an executable example", () =>
    expect(runPressurePotential(pressurePotentialExample.input)).toEqual({
      ok: true,
      output: pressurePotentialExample.output,
    }));
  it("returns zero when potentials match", () =>
    expect(
      runPressurePotential({
        osmoticPotentialMpa: -0.9,
        waterPotentialTotalMpa: -0.9,
      }),
    ).toEqual({ ok: true, output: { pressurePotentialMpa: 0 } }));
  it("returns signed values", () =>
    expect(
      runPressurePotential({
        osmoticPotentialMpa: -0.5,
        waterPotentialTotalMpa: -1.2,
      }),
    ).toEqual({ ok: true, output: { pressurePotentialMpa: -0.7 } }));
  it("rejects non-finite inputs", () =>
    expect(
      runPressurePotential({
        osmoticPotentialMpa: Number.NEGATIVE_INFINITY,
        waterPotentialTotalMpa: -0.8,
      }).ok,
    ).toBe(false));
});
