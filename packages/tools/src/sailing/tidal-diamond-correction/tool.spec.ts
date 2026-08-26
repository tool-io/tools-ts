import { describe, expect, it } from "vitest";
import {
  calculateTidalDiamondCorrection,
  runTidalDiamondCorrection,
  tidalDiamondCorrectionExample,
} from "./tool.js";

describe("Tidal Diamond Vector Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runTidalDiamondCorrection(tidalDiamondCorrectionExample.input),
    ).toEqual({
      ok: true,
      output: tidalDiamondCorrectionExample.output,
    }));

  it("resolves a following current entirely along the course", () =>
    expect(
      runTidalDiamondCorrection({
        courseDeg: 45,
        currentDriftKt: 2,
        currentSetDeg: 45,
      }),
    ).toEqual({
      ok: true,
      output: { alongCourseComponentKt: 2, crossCourseComponentKt: 0 },
    }));

  it("resolves a head current negatively along the course", () =>
    expect(
      runTidalDiamondCorrection({
        courseDeg: 45,
        currentDriftKt: 2,
        currentSetDeg: 225,
      }),
    ).toEqual({
      ok: true,
      output: {
        alongCourseComponentKt: -2,
        crossCourseComponentKt: 2.4492935982947064e-16,
      },
    }));

  it("resolves a perpendicular current entirely across the course", () => {
    const result = calculateTidalDiamondCorrection({
      courseDeg: 90,
      currentDriftKt: 2,
      currentSetDeg: 180,
    });
    expect(result.alongCourseComponentKt).toBeCloseTo(0, 12);
    expect(result.crossCourseComponentKt).toBe(2);
  });

  it.each([
    [0, 3, 60],
    [350, 1.5, 10],
    [200, 4, 20],
  ])(
    "keeps set minus course in the trigonometric functions",
    (currentSetDeg, currentDriftKt, courseDeg) => {
      const result = calculateTidalDiamondCorrection({
        courseDeg,
        currentDriftKt,
        currentSetDeg,
      });
      const rad = (currentSetDeg - courseDeg) * (Math.PI / 180);
      expect(result.alongCourseComponentKt).toBe(
        currentDriftKt * Math.cos(rad),
      );
      expect(result.crossCourseComponentKt).toBe(
        currentDriftKt * Math.sin(rad),
      );
    },
  );

  it("yields zero components for zero drift", () => {
    const result = runTidalDiamondCorrection({
      courseDeg: 123,
      currentDriftKt: 0,
      currentSetDeg: 300,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected success");
    expect(Object.is(result.output.alongCourseComponentKt, -0)).toBe(true);
    expect(Object.is(result.output.crossCourseComponentKt, 0)).toBe(true);
  });

  it("rejects sets and courses outside zero to three-sixty", () => {
    for (const input of [
      { courseDeg: 90, currentDriftKt: 2, currentSetDeg: -1 },
      { courseDeg: 90, currentDriftKt: 2, currentSetDeg: 361 },
      { courseDeg: -0.5, currentDriftKt: 2, currentSetDeg: 45 },
      { courseDeg: 360.5, currentDriftKt: 2, currentSetDeg: 45 },
    ])
      expect(runTidalDiamondCorrection(input).ok).toBe(false);
  });

  it("rejects negative drift", () => {
    const result = runTidalDiamondCorrection({
      courseDeg: 90,
      currentDriftKt: -1,
      currentSetDeg: 45,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects non-finite and malformed input", () => {
    expect(
      runTidalDiamondCorrection({
        courseDeg: Number.NaN,
        currentDriftKt: 2,
        currentSetDeg: 45,
      }).ok,
    ).toBe(false);
    expect(
      runTidalDiamondCorrection({ courseDeg: 90, currentSetDeg: 45 }).ok,
    ).toBe(false);
  });
});
