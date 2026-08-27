import { describe, expect, it } from "vitest";
import { runTurgorPressure, turgorPressureExample } from "./tool.js";

describe("Turgor Pressure Estimate", () => {
  it("publishes an executable example", () =>
    expect(runTurgorPressure(turgorPressureExample.input)).toEqual({
      ok: true,
      output: turgorPressureExample.output,
    }));
  it("floors at zero for flaccid cells", () =>
    expect(
      runTurgorPressure({
        osmoticPotentialMpa: -0.5,
        waterPotentialTotalMpa: -1.2,
      }),
    ).toEqual({ ok: true, output: { turgorPressureMpa: 0 } }));
  it("returns zero at equilibrium", () =>
    expect(
      runTurgorPressure({
        osmoticPotentialMpa: -0.9,
        waterPotentialTotalMpa: -0.9,
      }),
    ).toEqual({ ok: true, output: { turgorPressureMpa: 0 } }));
  it("accepts positive potentials", () =>
    expect(
      runTurgorPressure({
        osmoticPotentialMpa: -0.4,
        waterPotentialTotalMpa: 0.2,
      }),
    ).toEqual({ ok: true, output: { turgorPressureMpa: 0.6000000000000001 } }));
  it("rejects non-finite inputs", () => {
    expect(
      runTurgorPressure({
        osmoticPotentialMpa: Number.NaN,
        waterPotentialTotalMpa: -0.8,
      }).ok,
    ).toBe(false);
    expect(
      runTurgorPressure({
        osmoticPotentialMpa: -0.9,
        waterPotentialTotalMpa: Infinity,
      }).ok,
    ).toBe(false);
  });
});
