import { describe, expect, it } from "vitest";
import { massSpecMzExample, runMassSpecMz } from "./tool.js";
describe("Mass Spec m/z Calculator", () => {
  it("publishes an executable example", () =>
    expect(runMassSpecMz(massSpecMzExample.input)).toEqual({
      ok: true,
      output: massSpecMzExample.output,
    }));
  it("adds one proton mass for a singly charged ion", () =>
    expect(runMassSpecMz({ neutralMassDa: 180, chargeInt: 1 })).toEqual({
      ok: true,
      output: { massToChargeRatio: 181.007276 },
    }));
  it("lowers m/z as charge increases", () =>
    expect(runMassSpecMz({ neutralMassDa: 180, chargeInt: 3 })).toEqual({
      ok: true,
      output: { massToChargeRatio: 61.007276 },
    }));
  it("matches a protein-like multiply charged ion closely", () => {
    const result = runMassSpecMz({ neutralMassDa: 12000, chargeInt: 9 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.massToChargeRatio).toBeCloseTo(1334.340609, 6);
  });
  it("rejects zero mass", () =>
    expect(runMassSpecMz({ neutralMassDa: 0, chargeInt: 2 }).ok).toBe(false));
  it("rejects negative mass", () =>
    expect(runMassSpecMz({ neutralMassDa: -180, chargeInt: 2 }).ok).toBe(
      false,
    ));
  it("rejects zero charge", () =>
    expect(runMassSpecMz({ neutralMassDa: 180, chargeInt: 0 }).ok).toBe(false));
  it("rejects fractional charge", () =>
    expect(runMassSpecMz({ neutralMassDa: 180, chargeInt: 1.5 }).ok).toBe(
      false,
    ));
});
