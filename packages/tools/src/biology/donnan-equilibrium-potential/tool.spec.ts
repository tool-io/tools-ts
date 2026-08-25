import { describe, expect, it } from "vitest";
import {
  donnanEquilibriumPotentialExample,
  runDonnanEquilibriumPotential,
} from "./tool.js";

describe("Donnan Potential", () => {
  it("publishes an executable example", () =>
    expect(
      runDonnanEquilibriumPotential(donnanEquilibriumPotentialExample.input),
    ).toEqual({
      ok: true,
      output: donnanEquilibriumPotentialExample.output,
    }));
  it("halves for divalent ions", () =>
    expect(
      runDonnanEquilibriumPotential({
        chargeZ: 2,
        insideConcM: 0.1,
        outsideConcM: 0.01,
      }),
    ).toEqual({ ok: true, output: { donnanPotentialMV: 29.58 } }));
  it("thirds for trivalent ions", () =>
    expect(
      runDonnanEquilibriumPotential({
        chargeZ: 3,
        insideConcM: 0.1,
        outsideConcM: 0.01,
      }),
    ).toEqual({ ok: true, output: { donnanPotentialMV: 19.72 } }));
  it("flips sign when the gradient reverses", () =>
    expect(
      runDonnanEquilibriumPotential({
        chargeZ: 1,
        insideConcM: 0.001,
        outsideConcM: 0.1,
      }),
    ).toEqual({ ok: true, output: { donnanPotentialMV: -118.32 } }));
  it("is zero at equilibrium concentrations", () =>
    expect(
      runDonnanEquilibriumPotential({
        chargeZ: 1,
        insideConcM: 0.05,
        outsideConcM: 0.05,
      }),
    ).toEqual({ ok: true, output: { donnanPotentialMV: 0 } }));
  it("rejects a zero valence", () =>
    expect(
      runDonnanEquilibriumPotential({
        chargeZ: 0,
        insideConcM: 0.1,
        outsideConcM: 0.01,
      }).ok,
    ).toBe(false));
  it("rejects valence above three", () =>
    expect(
      runDonnanEquilibriumPotential({
        chargeZ: 4,
        insideConcM: 0.1,
        outsideConcM: 0.01,
      }).ok,
    ).toBe(false));
  it("reverses sign for anions", () =>
    expect(
      runDonnanEquilibriumPotential({
        chargeZ: -1,
        insideConcM: 0.1,
        outsideConcM: 0.01,
      }),
    ).toEqual({ ok: true, output: { donnanPotentialMV: -59.16 } }));
  it("rejects zero outside concentration", () =>
    expect(
      runDonnanEquilibriumPotential({
        chargeZ: 1,
        insideConcM: 0.1,
        outsideConcM: 0,
      }).ok,
    ).toBe(false));
});
