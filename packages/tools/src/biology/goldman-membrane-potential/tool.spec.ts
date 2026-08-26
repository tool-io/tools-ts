import { describe, expect, it } from "vitest";
import { runGoldmanMembranePotential } from "./tool.js";

const classicInput = {
  chlorideInsideMm: 30,
  chlorideOutsideMm: 110,
  chloridePermeability: 0.45,
  potassiumInsideMm: 140,
  potassiumOutsideMm: 4,
  potassiumPermeability: 1,
  sodiumInsideMm: 12,
  sodiumOutsideMm: 145,
  sodiumPermeability: 0.04,
};

describe("Goldman Equation", () => {
  it("calculates the classic resting potential", () =>
    expect(runGoldmanMembranePotential(classicInput)).toEqual({
      ok: true,
      output: { membranePotentialMV: -56.04814568218529 },
    }));
  it("reduces to the Nernst potential for potassium alone", () => {
    const result = runGoldmanMembranePotential({
      ...classicInput,
      chloridePermeability: 0,
      sodiumPermeability: 0,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.membranePotentialMV).toBeCloseTo(
        61.5 * Math.log10(4 / 140),
        9,
      );
  });
  it("approaches the sodium equilibrium as sodium permeability dominates", () => {
    const result = runGoldmanMembranePotential({
      ...classicInput,
      chloridePermeability: 0,
      potassiumPermeability: 0,
      sodiumPermeability: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.membranePotentialMV).toBeCloseTo(
        61.5 * Math.log10(145 / 12),
        9,
      );
  });
  it("inverts chloride terms across the membrane", () => {
    const chlorideOnly = runGoldmanMembranePotential({
      ...classicInput,
      chloridePermeability: 1,
      potassiumPermeability: 0,
      sodiumPermeability: 0,
    });
    expect(chlorideOnly.ok).toBe(true);
    if (chlorideOnly.ok)
      expect(chlorideOnly.output.membranePotentialMV).toBeCloseTo(
        61.5 * Math.log10(30 / 110),
        9,
      );
  });
  it("rejects all-zero permeabilities", () => {
    const result = runGoldmanMembranePotential({
      ...classicInput,
      chloridePermeability: 0,
      potassiumPermeability: 0,
      sodiumPermeability: 0,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative permeabilities", () =>
    expect(
      runGoldmanMembranePotential({
        ...classicInput,
        potassiumPermeability: -1,
      }).ok,
    ).toBe(false));
  it("rejects non-positive concentrations", () =>
    expect(
      runGoldmanMembranePotential({ ...classicInput, potassiumInsideMm: 0 }).ok,
    ).toBe(false));
  it("rejects unknown fields", () =>
    expect(
      runGoldmanMembranePotential({ ...classicInput, extraField: 1 }).ok,
    ).toBe(false));
});
