import { describe, expect, it } from "vitest";
import { ejectionFractionExample, runEjectionFraction } from "./tool.js";

describe("Ejection Fraction %", () => {
  it("publishes an executable example", () =>
    expect(runEjectionFraction(ejectionFractionExample.input)).toEqual({
      ok: true,
      output: ejectionFractionExample.output,
    }));
  it("computes half of the end-diastolic volume", () =>
    expect(
      runEjectionFraction({ endDiastolicMl: 160, strokeVolumeMl: 80 }),
    ).toEqual({ ok: true, output: { ejectionFractionPercent: 50 } }));
  it("allows zero stroke volume", () =>
    expect(
      runEjectionFraction({ endDiastolicMl: 120, strokeVolumeMl: 0 }),
    ).toEqual({ ok: true, output: { ejectionFractionPercent: 0 } }));
  it("rejects zero end-diastolic volume", () => {
    const result = runEjectionFraction({
      endDiastolicMl: 0,
      strokeVolumeMl: 70,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative end-diastolic volume", () => {
    const result = runEjectionFraction({
      endDiastolicMl: -120,
      strokeVolumeMl: 70,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects non-finite stroke volume", () => {
    const result = runEjectionFraction({
      endDiastolicMl: 120,
      strokeVolumeMl: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects stroke volume above end-diastolic volume", () =>
    expect(
      runEjectionFraction({ endDiastolicMl: 100, strokeVolumeMl: 120 }).ok,
    ).toBe(false));
});
