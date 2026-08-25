import { describe, expect, it } from "vitest";
import { runCorrectedReticulocyteCount } from "./tool.js";

describe("Corrected Retic Percent", () => {
  it("halves the percent at half the normal hematocrit", () =>
    expect(
      runCorrectedReticulocyteCount({
        patientHematocritPercent: 22.5,
        reticulocytePercent: 2,
      }),
    ).toEqual({ ok: true, output: { correctedReticulocytePercent: 1 } }));
  it("leaves the percent unchanged against the default reference", () =>
    expect(
      runCorrectedReticulocyteCount({
        patientHematocritPercent: 45,
        reticulocytePercent: 6,
      }),
    ).toEqual({ ok: true, output: { correctedReticulocytePercent: 6 } }));
  it("supports an explicit reference hematocrit", () =>
    expect(
      runCorrectedReticulocyteCount({
        normalHematocritPercent: 40,
        patientHematocritPercent: 20,
        reticulocytePercent: 6,
      }),
    ).toEqual({ ok: true, output: { correctedReticulocytePercent: 3 } }));
  it("yields zero without reticulocytes", () =>
    expect(
      runCorrectedReticulocyteCount({
        patientHematocritPercent: 20,
        reticulocytePercent: 0,
      }),
    ).toEqual({ ok: true, output: { correctedReticulocytePercent: 0 } }));
  it("keeps fractional results", () =>
    expect(
      runCorrectedReticulocyteCount({
        patientHematocritPercent: 15,
        reticulocytePercent: 4,
      }),
    ).toEqual({
      ok: true,
      output: { correctedReticulocytePercent: 1.3333333333333333 },
    }));
  it("rejects a non positive patient hematocrit", () => {
    const result = runCorrectedReticulocyteCount({
      patientHematocritPercent: 0,
      reticulocytePercent: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects a non positive reference hematocrit", () => {
    const result = runCorrectedReticulocyteCount({
      normalHematocritPercent: -45,
      patientHematocritPercent: 45,
      reticulocytePercent: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("normalHematocritPercent");
  });
});
