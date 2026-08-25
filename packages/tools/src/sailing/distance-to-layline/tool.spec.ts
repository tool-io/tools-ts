import { describe, expect, it } from "vitest";
import { distanceToLaylineExample, runDistanceToLayline } from "./tool.js";

describe("distance to layline calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDistanceToLayline(distanceToLaylineExample.input)).toEqual({
      ok: true,
      output: distanceToLaylineExample.output,
    });
  });

  it("returns zero for a zero lateral offset", () => {
    expect(
      runDistanceToLayline({ lateralOffsetNm: 0, tackingAngleDeg: 30 }),
    ).toEqual({
      ok: true,
      output: { distanceToLaylineNm: 0 },
    });
  });

  it("takes the absolute value of negative offsets", () => {
    const result = runDistanceToLayline({
      lateralOffsetNm: -2,
      tackingAngleDeg: 40,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.distanceToLaylineNm).toBe(5.494954838909245);
  });

  it("grows large for near-vertical small tacking angles", () => {
    const result = runDistanceToLayline({
      lateralOffsetNm: 1,
      tackingAngleDeg: 6,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.distanceToLaylineNm).toBeCloseTo(
      19.08113668772821,
      12,
    );
  });

  it("uses half of the total angle between tacks", () => {
    const result = runDistanceToLayline({
      lateralOffsetNm: 2,
      tackingAngleDeg: 88,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.distanceToLaylineNm).toBeCloseTo(2.071060627581139);
  });

  it("accepts a five-degree total angle", () => {
    expect(
      runDistanceToLayline({ lateralOffsetNm: 1, tackingAngleDeg: 5 }),
    ).toMatchObject({ ok: true });
  });

  it("accepts an eighty-nine-degree total angle", () => {
    expect(
      runDistanceToLayline({ lateralOffsetNm: 1, tackingAngleDeg: 89 }),
    ).toMatchObject({ ok: true });
  });

  it("rejects angles outside the schema range through validation", () => {
    for (const tackingAngleDeg of [0, 180])
      expect(
        runDistanceToLayline({ lateralOffsetNm: 1, tackingAngleDeg }).ok,
      ).toBe(false);
  });

  it("rejects missing required inputs", () => {
    expect(runDistanceToLayline({ tackingAngleDeg: 45 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lateralOffsetNm" }] },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { lateralOffsetNm: Number.NaN, tackingAngleDeg: 40 },
      { lateralOffsetNm: 2, tackingAngleDeg: Number.POSITIVE_INFINITY },
    ])
      expect(runDistanceToLayline(bad).ok).toBe(false);
  });
});
