import { describe, expect, it } from "vitest";
import { runReticulocyteProductionIndex } from "./tool.js";

describe("RPI Corrected", () => {
  it("corrects for the anemic hematocrit with defaults", () =>
    expect(
      runReticulocyteProductionIndex({
        patientHematocritPercent: 22.5,
        reticulocytePercent: 2,
      }),
    ).toEqual({
      ok: true,
      output: { reticulocyteProductionIndex: 0.6666666666666666 },
    }));
  it("passes through at a normal hematocrit", () =>
    expect(
      runReticulocyteProductionIndex({
        patientHematocritPercent: 45,
        reticulocytePercent: 2,
      }),
    ).toEqual({
      ok: true,
      output: { reticulocyteProductionIndex: 1.3333333333333333 },
    }));
  it("applies an explicit maturation factor", () =>
    expect(
      runReticulocyteProductionIndex({
        maturationFactor: 3,
        normalHematocritPercent: 45,
        patientHematocritPercent: 30,
        reticulocytePercent: 2,
      }),
    ).toEqual({
      ok: true,
      output: { reticulocyteProductionIndex: 0.4444444444444444 },
    }));
  it("supports a custom reference hematocrit", () =>
    expect(
      runReticulocyteProductionIndex({
        normalHematocritPercent: 40,
        patientHematocritPercent: 20,
        reticulocytePercent: 6,
      }),
    ).toEqual({ ok: true, output: { reticulocyteProductionIndex: 2 } }));
  it("yields zero without reticulocytes", () =>
    expect(
      runReticulocyteProductionIndex({
        patientHematocritPercent: 22.5,
        reticulocytePercent: 0,
      }),
    ).toEqual({
      ok: true,
      output: { reticulocyteProductionIndex: 0 },
    }));
  it("rejects a non positive patient hematocrit", () => {
    const result = runReticulocyteProductionIndex({
      patientHematocritPercent: 0,
      reticulocytePercent: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects a reticulocyte percent below zero", () => {
    const result = runReticulocyteProductionIndex({
      patientHematocritPercent: 45,
      reticulocytePercent: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("reticulocytePercent");
  });
});
