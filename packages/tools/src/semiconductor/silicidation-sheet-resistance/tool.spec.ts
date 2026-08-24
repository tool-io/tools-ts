import { describe, expect, it } from "vitest";
import {
  calculateSilicidationSheetResistance,
  runSilicidationSheetResistance,
  silicidationSheetResistanceExample,
} from "./tool.js";

describe("silicide sheet resistance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSilicidationSheetResistance(silicidationSheetResistanceExample.input),
    ).toEqual({ ok: true, output: silicidationSheetResistanceExample.output });
  });

  it("maps 10 uohm*cm at 10 nm to exactly 10 ohm/sq", () => {
    expect(
      runSilicidationSheetResistance({
        filmResistivityMicroOhmCm: 10,
        filmThicknessNm: 10,
      }),
    ).toEqual({ ok: true, output: { sheetResistanceOhmsPerSq: 10 } });
  });

  it("maps 3 uohm*cm at 30 nm to exactly 1 ohm/sq", () => {
    expect(
      runSilicidationSheetResistance({
        filmResistivityMicroOhmCm: 3,
        filmThicknessNm: 30,
      }),
    ).toEqual({ ok: true, output: { sheetResistanceOhmsPerSq: 1 } });
  });

  it("handles fractional results from realistic cobalt silicide values", () => {
    expect(
      runSilicidationSheetResistance({
        filmResistivityMicroOhmCm: 15.6,
        filmThicknessNm: 40,
      }),
    ).toEqual({ ok: true, output: { sheetResistanceOhmsPerSq: 3.9 } });
  });

  it("maps 60 uohm*cm at 20 nm to exactly 30 ohm/sq", () => {
    expect(
      runSilicidationSheetResistance({
        filmResistivityMicroOhmCm: 60,
        filmThicknessNm: 20,
      }),
    ).toEqual({ ok: true, output: { sheetResistanceOhmsPerSq: 30 } });
  });

  it("halving the thickness doubles the sheet resistance", () => {
    const thick = calculateSilicidationSheetResistance({
      filmResistivityMicroOhmCm: 14,
      filmThicknessNm: 20,
    }).sheetResistanceOhmsPerSq;
    const thin = calculateSilicidationSheetResistance({
      filmResistivityMicroOhmCm: 14,
      filmThicknessNm: 10,
    }).sheetResistanceOhmsPerSq;
    expect(thin).toBe(thick * 2);
  });

  it("scales linearly with resistivity", () => {
    const base = calculateSilicidationSheetResistance({
      filmResistivityMicroOhmCm: 10,
      filmThicknessNm: 25,
    }).sheetResistanceOhmsPerSq;
    const tripled = calculateSilicidationSheetResistance({
      filmResistivityMicroOhmCm: 30,
      filmThicknessNm: 25,
    }).sheetResistanceOhmsPerSq;
    expect(tripled).toBeCloseTo(base * 3, 12);
  });

  it("avoids overflowing the unit conversion before division", () => {
    expect(
      calculateSilicidationSheetResistance({
        filmResistivityMicroOhmCm: Number.MAX_VALUE,
        filmThicknessNm: 10,
      }),
    ).toEqual({ sheetResistanceOhmsPerSq: Number.MAX_VALUE });
  });

  it("rejects zero and negative film resistivity", () => {
    const result = runSilicidationSheetResistance({
      filmResistivityMicroOhmCm: 0,
      filmThicknessNm: 10,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.code).toBe("invalid_input");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_film_resistivity",
      field: "filmResistivityMicroOhmCm",
    });
    if (
      runSilicidationSheetResistance({
        filmResistivityMicroOhmCm: -10,
        filmThicknessNm: 10,
      }).ok
    )
      throw new Error("expected failure");
  });

  it("rejects zero and negative film thickness", () => {
    const result = runSilicidationSheetResistance({
      filmResistivityMicroOhmCm: 10,
      filmThicknessNm: -5,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_film_thickness",
      field: "filmThicknessNm",
    });
    expect(
      runSilicidationSheetResistance({
        filmResistivityMicroOhmCm: 10,
        filmThicknessNm: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing, non-numeric, and non-finite inputs", () => {
    const missing = runSilicidationSheetResistance({});
    expect(missing.ok).toBe(false);
    if (missing.ok) throw new Error("expected failure");
    expect(missing.error.issues[0].code).toBe("invalid_field");
    expect(
      runSilicidationSheetResistance({
        filmResistivityMicroOhmCm: "titanium",
        filmThicknessNm: 10,
      }).ok,
    ).toBe(false);
    expect(
      runSilicidationSheetResistance({
        filmResistivityMicroOhmCm: Number.NaN,
        filmThicknessNm: 10,
      }).ok,
    ).toBe(false);
    expect(
      runSilicidationSheetResistance({
        filmResistivityMicroOhmCm: 10,
        filmThicknessNm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and non-object input", () => {
    const unknown = runSilicidationSheetResistance({
      filmResistivityMicroOhmCm: 10,
      filmThicknessNm: 10,
      annealC: 700,
    });
    expect(unknown.ok).toBe(false);
    if (unknown.ok) throw new Error("expected failure");
    expect(unknown.error.issues[0].code).toBe("unknown_field");
    const nonObject = runSilicidationSheetResistance(true);
    expect(nonObject.ok).toBe(false);
    if (nonObject.ok) throw new Error("expected failure");
    expect(nonObject.error.issues[0].code).toBe("object_required");
  });
});
