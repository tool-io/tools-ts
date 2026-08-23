import { describe, expect, it } from "vitest";
import { dealGroveExample, runDealGrove, calculateDealGrove } from "./tool.js";

describe("Deal-Grove Thickness Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDealGrove(dealGroveExample.input)).toEqual({
      ok: true,
      output: dealGroveExample.output,
    });
  });

  it("reduces to the square root of B t when A is zero", () => {
    const r1 = runDealGrove({ aNm: 0, bNm2PerHour: 0.5, timeHours: 2 });
    expect(r1.ok).toBe(true);
    if (r1.ok)
      expect(
        (r1.output as { oxideThicknessNm: number }).oxideThicknessNm,
      ).toBeCloseTo(1, 12);
    const r2 = runDealGrove({ aNm: 0, bNm2PerHour: 1, timeHours: 160 });
    expect(r2.ok).toBe(true);
    if (r2.ok)
      expect(
        (r2.output as { oxideThicknessNm: number }).oxideThicknessNm,
      ).toBeCloseTo(12.649110640673518, 12);
  });

  it("returns zero thickness for zero oxidation time", () => {
    expect(runDealGrove({ aNm: 20, bNm2PerHour: 0.4, timeHours: 0 })).toEqual({
      ok: true,
      output: { oxideThicknessNm: 0 },
    });
  });

  it("preserves thin growth when A is much larger than B·t", () => {
    expect(
      calculateDealGrove({
        aNm: 1e16,
        bNm2PerHour: 1,
        timeHours: 1,
      }).oxideThicknessNm,
    ).toBe(1e-16);
  });

  it("grows with longer oxidation times", () => {
    const r1 = runDealGrove({ aNm: 8, bNm2PerHour: 2, timeHours: 16 });
    expect(r1.ok).toBe(true);
    if (r1.ok)
      expect(
        (r1.output as { oxideThicknessNm: number }).oxideThicknessNm,
      ).toBeCloseTo(2.9282032302755088, 12);
    const r2 = runDealGrove({ aNm: 8, bNm2PerHour: 2, timeHours: 64 });
    expect(r2.ok).toBe(true);
    if (r2.ok)
      expect(
        (r2.output as { oxideThicknessNm: number }).oxideThicknessNm,
      ).toBeCloseTo(8, 12);
  });

  it("accepts zero linear rate constant as a boundary", () => {
    expect(runDealGrove({ aNm: 0, bNm2PerHour: 2, timeHours: 8 })).toEqual({
      ok: true,
      output: { oxideThicknessNm: 4 },
    });
  });

  it("rejects a zero parabolic rate constant via schema", () => {
    const result = runDealGrove({
      aNm: 20,
      bNm2PerHour: 0,
      timeHours: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "bNm2PerHour",
      });
  });

  it("rejects negative rate constants through schema validation", () => {
    const negativeA = runDealGrove({
      aNm: -1,
      bNm2PerHour: 0.4,
      timeHours: 100,
    });
    const negativeB = runDealGrove({
      aNm: 20,
      bNm2PerHour: -0.4,
      timeHours: 100,
    });
    expect(negativeA.ok).toBe(false);
    if (!negativeA.ok)
      expect(negativeA.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "aNm",
      });
    expect(negativeB.ok).toBe(false);
    if (!negativeB.ok)
      expect(negativeB.error.issues[0]?.field).toBe("bNm2PerHour");
  });

  it("rejects negative oxidation time through schema validation", () => {
    const result = runDealGrove({
      aNm: 20,
      bNm2PerHour: 0.4,
      timeHours: -100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "timeHours",
      });
  });

  it("rejects non-finite inputs", () => {
    const result = runDealGrove({
      aNm: Number.NaN,
      bNm2PerHour: 0.4,
      timeHours: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects missing required inputs", () => {
    const result = runDealGrove({ aNm: 20, bNm2PerHour: 0.4 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () => {
    const result = runDealGrove({
      aNm: 20,
      bNm2PerHour: 0.4,
      timeHours: 100,
      temperatureC: 1000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "temperatureC",
      });
  });

  it("rejects input that is not an object", () => {
    const result = runDealGrove(undefined);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("object_required");
  });

  it("direct finite and property: t=0 gives 0 thickness", () => {
    expect(
      calculateDealGrove({ aNm: 20, bNm2PerHour: 0.4, timeHours: 0 })
        .oxideThicknessNm,
    ).toBe(0);
    expect(() =>
      calculateDealGrove({ aNm: -1, bNm2PerHour: 0.4, timeHours: 10 }),
    ).toThrow();
    expect(() =>
      calculateDealGrove({ aNm: 20, bNm2PerHour: 0, timeHours: 10 }),
    ).toThrow();
  });
});
