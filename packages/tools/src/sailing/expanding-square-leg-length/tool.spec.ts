import { describe, expect, it } from "vitest";
import {
  calculateExpandingSquareLegLength,
  expandingSquareLegLengthExample,
  runExpandingSquareLegLength,
} from "./tool.js";

describe("Expanding Square Leg Length", () => {
  it("publishes an executable example", () =>
    expect(
      runExpandingSquareLegLength(expandingSquareLegLengthExample.input),
    ).toEqual({
      ok: true,
      output: expandingSquareLegLengthExample.output,
    }));

  it.each([
    [4, 2],
    [3.5, 1.75],
    [1, 0.5],
    [10, 5],
    [0.2, 0.1],
  ])(
    "halves the search radius for the first leg",
    (searchRadiusNm, expected) => {
      expect(calculateExpandingSquareLegLength({ searchRadiusNm })).toEqual({
        firstLegLengthNm: expected,
      });
    },
  );

  it("keeps fractional radii exact in binary halves", () => {
    expect(calculateExpandingSquareLegLength({ searchRadiusNm: 7 })).toEqual({
      firstLegLengthNm: 3.5,
    });
    expect(
      calculateExpandingSquareLegLength({ searchRadiusNm: 0.125 }),
    ).toEqual({
      firstLegLengthNm: 0.0625,
    });
  });

  it("scales proportionally with the radius", () => {
    const base = calculateExpandingSquareLegLength({
      searchRadiusNm: 2,
    })!.firstLegLengthNm;
    expect(
      calculateExpandingSquareLegLength({ searchRadiusNm: 20 })
        ?.firstLegLengthNm,
    ).toBe(base * 10);
  });

  it.each([[0], [-4], [-0.001]])(
    "rejects non-positive search radii",
    (searchRadiusNm) => {
      expect(calculateExpandingSquareLegLength({ searchRadiusNm })).toBeNull();
      const result = runExpandingSquareLegLength({ searchRadiusNm });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_radius");
    },
  );

  it("rejects non-finite radii at the schema level", () => {
    expect(runExpandingSquareLegLength({ searchRadiusNm: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runExpandingSquareLegLength({ searchRadiusNm: Number.POSITIVE_INFINITY })
        .ok,
    ).toBe(false);
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runExpandingSquareLegLength({ legs: 4, searchRadiusNm: 4 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "legs" }] },
      ok: false,
    });
    expect(runExpandingSquareLegLength(null as never).ok).toBe(false);
  });
});
