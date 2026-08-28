import { describe, expect, it } from "vitest";
import { runCommonIonSolubility, commonIonSolubilityExample } from "./tool.js";
describe("Common Ion Solubility", () => {
  it("publishes an executable example", () =>
    expect(runCommonIonSolubility(commonIonSolubilityExample.input)).toEqual({
      ok: true,
      output: commonIonSolubilityExample.output,
    }));
  it("suppresses solubility relative to pure water for silver chloride", () => {
    const result = runCommonIonSolubility({
      commonIonConcM: 0.1,
      ksp: 1.8e-10,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.molarSolubility).toBeCloseTo(1.8e-9, 15);
  });
  it("lowers solubility further with more common ion", () => {
    const dilute = runCommonIonSolubility({
      commonIonConcM: 0.01,
      ksp: 1.8e-10,
    });
    const concentrated = runCommonIonSolubility({
      commonIonConcM: 1,
      ksp: 1.8e-10,
    });
    expect(dilute.ok).toBe(true);
    expect(concentrated.ok).toBe(true);
    if (dilute.ok && concentrated.ok)
      expect(Number(concentrated.output.molarSolubility)).toBeLessThan(
        Number(dilute.output.molarSolubility),
      );
  });
  it("scales linearly with Ksp", () => {
    const base = runCommonIonSolubility({ commonIonConcM: 0.1, ksp: 1e-10 });
    const doubled = runCommonIonSolubility({ commonIonConcM: 0.1, ksp: 2e-10 });
    expect(base.ok).toBe(true);
    expect(doubled.ok).toBe(true);
    if (base.ok && doubled.ok)
      expect(
        Number(doubled.output.molarSolubility) /
          Number(base.output.molarSolubility),
      ).toBe(2);
  });
  it("rejects zero common ion concentration", () =>
    expect(runCommonIonSolubility({ commonIonConcM: 0, ksp: 1e-10 }).ok).toBe(
      false,
    ));
  it("rejects negative Ksp", () =>
    expect(
      runCommonIonSolubility({ commonIonConcM: 0.1, ksp: -1e-10 }).ok,
    ).toBe(false));
});
