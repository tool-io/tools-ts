import { describe, expect, it } from "vitest";
import {
  dayShapeVisibilityRangeExample,
  runDayShapeVisibilityRange,
} from "./tool.js";

describe("Day Shape Visibility Range", () => {
  it("calculates the canonical example exactly", () => {
    expect(
      runDayShapeVisibilityRange(dayShapeVisibilityRangeExample.input),
    ).toEqual({
      ok: true,
      output: { visibilityRangeNm: 0.7424933794203438 },
    });
  });

  it("scales linearly with shape size", () => {
    const small = runDayShapeVisibilityRange({ shapeSizeMeters: 1 });
    const large = runDayShapeVisibilityRange({ shapeSizeMeters: 3 });
    if (!small.ok || !large.ok) throw new Error("expected success");
    expect(large.output.visibilityRangeNm).toBeCloseTo(
      Number(small.output.visibilityRangeNm) * 3,
      10,
    );
  });

  it("uses the selected angular recognition threshold", () => {
    const result = runDayShapeVisibilityRange({ shapeSizeMeters: 0.5 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.visibilityRangeNm).toBeCloseTo(
      0.5 / Math.tan((5 * Math.PI) / (180 * 60)) / 1852,
      10,
    );
  });

  it("allows a stricter recognition angle", () => {
    const result = runDayShapeVisibilityRange({
      recognitionAngleArcmin: 10,
      shapeSizeMeters: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.visibilityRangeNm).toBeCloseTo(0.3712459043742816);
  });

  it("rejects zero and negative shape sizes", () => {
    expect(runDayShapeVisibilityRange({ shapeSizeMeters: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "shapeSizeMeters" }] },
      ok: false,
    });
    expect(runDayShapeVisibilityRange({ shapeSizeMeters: -1 }).ok).toBe(false);
  });

  it("rejects non-finite sizes", () => {
    expect(
      runDayShapeVisibilityRange({
        shapeSizeMeters: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runDayShapeVisibilityRange({
        colour: "black",
        shapeSizeMeters: 2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "colour" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runDayShapeVisibilityRange(null).ok).toBe(false);
    expect(runDayShapeVisibilityRange({}).ok).toBe(false);
  });
});
