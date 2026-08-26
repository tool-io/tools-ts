import { describe, expect, it } from "vitest";
import { runNernstMembranePotential } from "./tool.js";

describe("Nernst Membrane Potential", () => {
  it("calculates a valid monovalent result", () =>
    expect(
      runNernstMembranePotential({
        insideConcMm: 10,
        outsideConcMm: 100,
        zIonInt: 1,
      }),
    ).toEqual({
      ok: true,
      output: { membranePotentialMV: 61.5 },
    }));
  it("halves the potential for divalent ions", () =>
    expect(
      runNernstMembranePotential({
        insideConcMm: 15,
        outsideConcMm: 150,
        zIonInt: 2,
      }),
    ).toEqual({
      ok: true,
      output: { membranePotentialMV: 30.75 },
    }));
  it("returns zero at equal concentrations", () => {
    const result = runNernstMembranePotential({
      insideConcMm: 5,
      outsideConcMm: 5,
      zIonInt: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.membranePotentialMV).toBe(0);
  });
  it("flips sign when the gradient inverts", () => {
    const outward = runNernstMembranePotential({
      insideConcMm: 10,
      outsideConcMm: 100,
      zIonInt: 1,
    });
    const inward = runNernstMembranePotential({
      insideConcMm: 100,
      outsideConcMm: 10,
      zIonInt: 1,
    });
    expect(outward.ok && inward.ok).toBe(true);
    if (outward.ok && inward.ok)
      expect(Number(inward.output.membranePotentialMV)).toBe(
        -Number(outward.output.membranePotentialMV),
      );
  });
  it("accepts the maximum valence of three", () => {
    const result = runNernstMembranePotential({
      insideConcMm: 10,
      outsideConcMm: 100,
      zIonInt: 3,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.membranePotentialMV).toBeCloseTo(20.5, 12);
  });
  it("rejects valence outside one to three", () =>
    expect(
      runNernstMembranePotential({
        insideConcMm: 10,
        outsideConcMm: 100,
        zIonInt: 4,
      }).ok,
    ).toBe(false));
  it("rejects zero concentrations", () =>
    expect(
      runNernstMembranePotential({
        insideConcMm: 0,
        outsideConcMm: 100,
        zIonInt: 1,
      }).ok,
    ).toBe(false));
  it("rejects negative concentrations", () =>
    expect(
      runNernstMembranePotential({
        insideConcMm: -10,
        outsideConcMm: 100,
        zIonInt: 1,
      }).ok,
    ).toBe(false));
});
