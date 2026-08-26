import { describe, expect, it } from "vitest";
import { leafThicknessExample, runLeafThickness } from "./tool.js";

describe("Leaf Thickness Mean", () => {
  it("publishes an executable example", () =>
    expect(runLeafThickness(leafThicknessExample.input)).toEqual({
      ok: true,
      output: leafThicknessExample.output,
    }));
  it("returns the sum itself for a single slice", () =>
    expect(
      runLeafThickness({ slicesCountInt: 1, thicknessMeasurementsSumUm: 210 }),
    ).toEqual({ ok: true, output: { leafThicknessUm: 210 } }));
  it("falls as more slices are counted", () =>
    expect(
      runLeafThickness({ slicesCountInt: 9, thicknessMeasurementsSumUm: 450 }),
    ).toEqual({ ok: true, output: { leafThicknessUm: 50 } }));
  it("keeps fractional means exact", () =>
    expect(
      runLeafThickness({ slicesCountInt: 4, thicknessMeasurementsSumUm: 450 }),
    ).toEqual({ ok: true, output: { leafThicknessUm: 112.5 } }));
  it("accepts a zero measurement sum", () =>
    expect(
      runLeafThickness({ slicesCountInt: 4, thicknessMeasurementsSumUm: 0 }),
    ).toEqual({ ok: true, output: { leafThicknessUm: 0 } }));
  it("rejects zero slices", () => {
    const result = runLeafThickness({
      slicesCountInt: 0,
      thicknessMeasurementsSumUm: 450,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative sums", () => {
    const result = runLeafThickness({
      slicesCountInt: 5,
      thicknessMeasurementsSumUm: -1,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects non-integer slice counts", () => {
    const result = runLeafThickness({
      slicesCountInt: 2.5,
      thicknessMeasurementsSumUm: 450,
    });
    expect(result.ok).toBe(false);
  });
});
