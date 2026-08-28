import { describe, expect, it } from "vitest";
import {
  chromatographyPlateNumberExample,
  runChromatographyPlateNumber,
} from "./tool.js";
describe("Plate Number N", () => {
  it("publishes an executable example", () =>
    expect(
      runChromatographyPlateNumber(chromatographyPlateNumberExample.input),
    ).toEqual({
      ok: true,
      output: chromatographyPlateNumberExample.output,
    }));
  it("returns sixteen plates for equal time and width", () =>
    expect(
      runChromatographyPlateNumber({ retentionTimeMin: 3, peakWidthMin: 3 }),
    ).toEqual({ ok: true, output: { plateNumber: 16 } }));
  it("quarters plates when peak width doubles", () =>
    expect(
      runChromatographyPlateNumber({ retentionTimeMin: 10, peakWidthMin: 1 }),
    ).toEqual({ ok: true, output: { plateNumber: 1600 } }));
  it("quadruples plates when retention time doubles", () =>
    expect(
      runChromatographyPlateNumber({ retentionTimeMin: 20, peakWidthMin: 0.5 }),
    ).toEqual({ ok: true, output: { plateNumber: 25600 } }));
  it("matches a narrow late peak closely", () => {
    const result = runChromatographyPlateNumber({
      retentionTimeMin: 12.5,
      peakWidthMin: 0.25,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.plateNumber).toBeCloseTo(40000, 9);
  });
  it("rejects zero retention time", () =>
    expect(
      runChromatographyPlateNumber({ retentionTimeMin: 0, peakWidthMin: 1 }).ok,
    ).toBe(false));
  it("rejects negative retention time", () =>
    expect(
      runChromatographyPlateNumber({ retentionTimeMin: -10, peakWidthMin: 1 })
        .ok,
    ).toBe(false));
  it("rejects zero peak width", () =>
    expect(
      runChromatographyPlateNumber({ retentionTimeMin: 10, peakWidthMin: 0 })
        .ok,
    ).toBe(false));
});
