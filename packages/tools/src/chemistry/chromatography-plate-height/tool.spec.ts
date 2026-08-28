import { describe, expect, it } from "vitest";
import {
  chromatographyPlateHeightExample,
  runChromatographyPlateHeight,
} from "./tool.js";
describe("Plate Height H", () => {
  it("publishes an executable example", () =>
    expect(
      runChromatographyPlateHeight(chromatographyPlateHeightExample.input),
    ).toEqual({
      ok: true,
      output: chromatographyPlateHeightExample.output,
    }));
  it("doubles height for a doubled column at fixed plates", () =>
    expect(
      runChromatographyPlateHeight({ columnLengthMm: 300, plateNumber: 15000 }),
    ).toEqual({ ok: true, output: { plateHeightUm: 20 } }));
  it("halves height when plates double", () =>
    expect(
      runChromatographyPlateHeight({ columnLengthMm: 150, plateNumber: 30000 }),
    ).toEqual({ ok: true, output: { plateHeightUm: 5 } }));
  it("matches a long UHPLC column closely", () => {
    const result = runChromatographyPlateHeight({
      columnLengthMm: 250,
      plateNumber: 125000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.plateHeightUm).toBeCloseTo(2, 12);
  });
  it("converts millimeters to micrometers exactly", () =>
    expect(
      runChromatographyPlateHeight({ columnLengthMm: 1, plateNumber: 1000 }),
    ).toEqual({ ok: true, output: { plateHeightUm: 1 } }));
  it("rejects zero column length", () =>
    expect(
      runChromatographyPlateHeight({ columnLengthMm: 0, plateNumber: 15000 })
        .ok,
    ).toBe(false));
  it("rejects negative column length", () =>
    expect(
      runChromatographyPlateHeight({
        columnLengthMm: -150,
        plateNumber: 15000,
      }).ok,
    ).toBe(false));
  it("rejects zero plate number", () =>
    expect(
      runChromatographyPlateHeight({ columnLengthMm: 150, plateNumber: 0 }).ok,
    ).toBe(false));
});
