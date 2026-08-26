import { describe, expect, it } from "vitest";
import {
  calculateSectorSearchLegLength,
  sectorSearchLegLengthExample,
  runSectorSearchLegLength,
} from "./tool.js";

const chord = (radiusNm: number, sectorAngleDeg: number): number =>
  2 * radiusNm * Math.sin((sectorAngleDeg / 2) * (Math.PI / 180));

describe("Sector Search Leg Length", () => {
  it("publishes an executable example", () =>
    expect(
      runSectorSearchLegLength(sectorSearchLegLengthExample.input),
    ).toEqual({
      ok: true,
      output: sectorSearchLegLengthExample.output,
    }));

  it.each([
    [2, 30],
    [3, 60],
    [1, 120],
    [5, 45],
    [10, 30],
  ])(
    "matches the chord formula across sector angles",
    (radiusNm, sectorAngleDeg) => {
      expect(
        calculateSectorSearchLegLength({ radiusNm, sectorAngleDeg }),
      ).toEqual({ chordLengthNm: chord(radiusNm, sectorAngleDeg) });
    },
  );

  it("widens the chord as the sector angle grows", () => {
    const narrow = calculateSectorSearchLegLength({
      radiusNm: 2,
      sectorAngleDeg: 30,
    })!.chordLengthNm;
    const wide = calculateSectorSearchLegLength({
      radiusNm: 2,
      sectorAngleDeg: 120,
    })!.chordLengthNm;
    expect(wide).toBeGreaterThan(narrow);
  });

  it("equals the diameter for a full half-circle sector", () => {
    expect(
      calculateSectorSearchLegLength({ radiusNm: 3, sectorAngleDeg: 120 }),
    ).not.toBeNull();
    expect(chord(3, 180)).toBe(6);
  });

  it("defaults the sector angle to thirty degrees", () => {
    expect(runSectorSearchLegLength({ radiusNm: 2 })).toEqual({
      ok: true,
      output: { chordLengthNm: chord(2, 30) },
    });
  });

  it.each([[29], [121], [-30]])(
    "rejects sector angles outside thirty to one hundred twenty",
    (sectorAngleDeg) => {
      expect(
        runSectorSearchLegLength({ radiusNm: 2, sectorAngleDeg }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
    },
  );

  it.each([[0], [-2]])("rejects non-positive radii", (radiusNm) => {
    expect(calculateSectorSearchLegLength({ radiusNm })).toBeNull();
    const result = runSectorSearchLegLength({ radiusNm });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_radius");
  });

  it("rejects unknown fields and null input", () => {
    expect(runSectorSearchLegLength({ radiusNm: 2, sweeps: 5 })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "sweeps" }] },
      ok: false,
    });
    expect(runSectorSearchLegLength(null as never).ok).toBe(false);
  });
});
