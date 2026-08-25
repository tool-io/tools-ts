import { describe, expect, it } from "vitest";
import {
  calculateLaylineOverstand,
  laylineOverstandExample,
  runLaylineOverstand,
} from "./tool.js";

describe("Overstand Distance Calculator", () => {
  it("publishes an executable example", () =>
    expect(runLaylineOverstand(laylineOverstandExample.input)).toEqual({
      ok: true,
      output: laylineOverstandExample.output,
    }));

  it("loses no distance with zero overstand", () =>
    expect(
      runLaylineOverstand({
        distanceToMarkNm: 2,
        overstandDegrees: 0,
        tackingAngleDeg: 44,
      }),
    ).toEqual({
      ok: true,
      output: { overstandDistanceNm: 0 },
    }));

  it.each([
    [4, 15, 30, 2.0705523608201664],
    [3, 5, 40, 0.40677079692074525],
    [1, 30, 60, 0.5773502691896257],
  ])(
    "computes the overstand distance",
    (distanceToMarkNm, overstandDegrees, tackingAngleDeg, expected) => {
      expect(
        calculateLaylineOverstand({
          distanceToMarkNm,
          overstandDegrees,
          tackingAngleDeg,
        }),
      ).toEqual({
        overstandDistanceNm: expected,
      });
    },
  );

  it("scales linearly with distance to the mark", () => {
    const near = calculateLaylineOverstand({
      distanceToMarkNm: 1,
      overstandDegrees: 10,
      tackingAngleDeg: 44,
    });
    const far = calculateLaylineOverstand({
      distanceToMarkNm: 5,
      overstandDegrees: 10,
      tackingAngleDeg: 44,
    });
    expect(far.overstandDistanceNm).toBe(near.overstandDistanceNm * 5);
  });

  it("accepts the boundary angles", () => {
    expect(
      runLaylineOverstand({
        distanceToMarkNm: 2,
        overstandDegrees: 0,
        tackingAngleDeg: 20,
      }).ok,
    ).toBe(true);
    expect(
      runLaylineOverstand({
        distanceToMarkNm: 2,
        overstandDegrees: 45,
        tackingAngleDeg: 89,
      }).ok,
    ).toBe(true);
  });

  it("accepts zero distance and rejects negative distances", () => {
    expect(
      runLaylineOverstand({
        distanceToMarkNm: 0,
        overstandDegrees: 10,
        tackingAngleDeg: 44,
      }),
    ).toEqual({ ok: true, output: { overstandDistanceNm: 0 } });
    const result = runLaylineOverstand({
      distanceToMarkNm: -1,
      overstandDegrees: 10,
      tackingAngleDeg: 44,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects angles outside their schema ranges", () => {
    for (const input of [
      { distanceToMarkNm: 2, overstandDegrees: -1, tackingAngleDeg: 44 },
      { distanceToMarkNm: 2, overstandDegrees: 46, tackingAngleDeg: 44 },
      { distanceToMarkNm: 2, overstandDegrees: 10, tackingAngleDeg: 19.5 },
      { distanceToMarkNm: 2, overstandDegrees: 10, tackingAngleDeg: 90 },
    ])
      expect(runLaylineOverstand(input).ok).toBe(false);
  });

  it("rejects non-finite and malformed input", () => {
    expect(
      runLaylineOverstand({
        distanceToMarkNm: Number.NaN,
        overstandDegrees: 10,
        tackingAngleDeg: 44,
      }).ok,
    ).toBe(false);
    expect(
      runLaylineOverstand({ distanceToMarkNm: 2, overstandDegrees: 10 }).ok,
    ).toBe(false);
  });
});
