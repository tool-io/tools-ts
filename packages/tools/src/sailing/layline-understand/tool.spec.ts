import { describe, expect, it } from "vitest";
import { calculateLaylineOverstand } from "../layline-overstand/tool.js";
import {
  calculateLaylineUnderstand,
  laylineUnderstandExample,
  runLaylineUnderstand,
} from "./tool.js";

describe("Understand Distance Calculator", () => {
  it("publishes an executable example", () =>
    expect(runLaylineUnderstand(laylineUnderstandExample.input)).toEqual({
      ok: true,
      output: laylineUnderstandExample.output,
    }));

  it("gains nothing with zero understand", () =>
    expect(
      runLaylineUnderstand({
        distanceToMarkNm: 2,
        tackingAngleDeg: 44,
        understandDegrees: 0,
      }),
    ).toEqual({
      ok: true,
      output: { understandDistanceNm: 0 },
    }));

  it.each([
    [4, 15, 30, 2.0705523608201664],
    [3, 5, 40, 0.40677079692074525],
    [1, 30, 60, 0.5773502691896257],
  ])(
    "computes the understand distance",
    (distanceToMarkNm, understandDegrees, tackingAngleDeg, expected) => {
      expect(
        calculateLaylineUnderstand({
          distanceToMarkNm,
          tackingAngleDeg,
          understandDegrees,
        }),
      ).toEqual({
        understandDistanceNm: expected,
      });
    },
  );

  it("matches the overstand magnitude for identical angles", () => {
    const result = calculateLaylineUnderstand({
      distanceToMarkNm: 2.5,
      tackingAngleDeg: 38,
      understandDegrees: 12,
    });
    expect(result.understandDistanceNm).toBe(
      (2.5 * Math.sin(12 * (Math.PI / 180))) / Math.sin(38 * (Math.PI / 180)),
    );
    expect(
      calculateLaylineOverstand({
        distanceToMarkNm: 2.5,
        overstandDegrees: 12,
        tackingAngleDeg: 38,
      }).overstandDistanceNm,
    ).toBe(result.understandDistanceNm);
  });

  it("accepts the boundary angles", () => {
    expect(
      runLaylineUnderstand({
        distanceToMarkNm: 2,
        tackingAngleDeg: 20,
        understandDegrees: 45,
      }).ok,
    ).toBe(true);
    expect(
      runLaylineUnderstand({
        distanceToMarkNm: 2,
        tackingAngleDeg: 89,
        understandDegrees: 0,
      }).ok,
    ).toBe(true);
  });

  it("accepts zero distance and rejects negative distances", () => {
    expect(
      runLaylineUnderstand({
        distanceToMarkNm: 0,
        tackingAngleDeg: 44,
        understandDegrees: 10,
      }),
    ).toEqual({ ok: true, output: { understandDistanceNm: 0 } });
    const result = runLaylineUnderstand({
      distanceToMarkNm: -3,
      tackingAngleDeg: 44,
      understandDegrees: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects angles outside their schema ranges", () => {
    for (const input of [
      { distanceToMarkNm: 2, tackingAngleDeg: 44, understandDegrees: 46 },
      { distanceToMarkNm: 2, tackingAngleDeg: 10, understandDegrees: 10 },
      { distanceToMarkNm: 2, tackingAngleDeg: 95, understandDegrees: 10 },
    ])
      expect(runLaylineUnderstand(input).ok).toBe(false);
  });

  it("rejects non-finite and malformed input", () => {
    expect(
      runLaylineUnderstand({
        distanceToMarkNm: Number.POSITIVE_INFINITY,
        tackingAngleDeg: 44,
        understandDegrees: 10,
      }).ok,
    ).toBe(false);
    expect(
      runLaylineUnderstand({
        distanceToMarkNm: 2,
        tackingAngleDeg: 44,
        understandDegrees: 10,
        extra: 1,
      }).ok,
    ).toBe(false);
  });
});
