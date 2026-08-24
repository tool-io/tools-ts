import { describe, expect, it } from "vitest";
import { sigeStrainExample, runSigeStrain } from "./tool.js";

const strainOf = (result: ReturnType<typeof runSigeStrain>): number => {
  if (!result.ok) throw new Error("Expected success result.");
  const value = result.output.strainPercent;
  if (typeof value !== "number") throw new Error("Expected numeric strain.");
  return value;
};

describe("Pseudomorphic SiGe Strain Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runSigeStrain(sigeStrainExample.input)).toEqual({
      ok: true,
      output: { strainPercent: -0.8290117595500672 },
    }));

  it("reports zero strain for pure silicon", () =>
    expect(runSigeStrain({ germaniumFractionX: 0 })).toEqual({
      ok: true,
      output: { strainPercent: 0 },
    }));

  it("reports full compressive strain at x = 1", () =>
    expect(runSigeStrain({ germaniumFractionX: 1 })).toEqual({
      ok: true,
      output: { strainPercent: -4.012018381053381 },
    }));

  it("evaluates a mid-range composition", () =>
    expect(runSigeStrain({ germaniumFractionX: 0.5 })).toEqual({
      ok: true,
      output: { strainPercent: -2.047073676616469 },
    }));

  it("grows compressively with the germanium fraction", () => {
    const low = runSigeStrain({ germaniumFractionX: 0.2 });
    const high = runSigeStrain({ germaniumFractionX: 0.8 });
    expect(low).toMatchObject({ ok: true });
    expect(high).toMatchObject({ ok: true });
    expect(strainOf(high)).toBeLessThan(strainOf(low));
  });

  it("is non-positive across the valid range", () => {
    const result = runSigeStrain({ germaniumFractionX: 0.6 });
    expect(result).toMatchObject({ ok: true });
    expect(strainOf(result)).toBeLessThanOrEqual(0);
  });

  it("rejects a fraction below the valid range", () =>
    expect(runSigeStrain({ germaniumFractionX: -0.01 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
      },
      ok: false,
    }));

  it("rejects a fraction above the valid range", () =>
    expect(runSigeStrain({ germaniumFractionX: 1.01 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
      },
      ok: false,
    }));

  it("rejects a non-finite fraction", () =>
    expect(runSigeStrain({ germaniumFractionX: Number.NaN })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
      },
      ok: false,
    }));

  it("rejects a missing fraction", () =>
    expect(runSigeStrain({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(runSigeStrain({ germaniumFractionX: 0.2, extra: 1 })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
