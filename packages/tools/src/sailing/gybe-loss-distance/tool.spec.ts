import { describe, expect, it } from "vitest";
import {
  calculateGybeLossDistance,
  gybeLossDistanceExample,
  runGybeLossDistance,
} from "./tool.js";

describe("Gybe Loss Distance", () => {
  it("publishes an executable example", () =>
    expect(runGybeLossDistance(gybeLossDistanceExample.input)).toEqual({
      ok: true,
      output: gybeLossDistanceExample.output,
    }));

  it("applies the default four boat lengths lost per gybe", () =>
    expect(runGybeLossDistance({ boatLengthMeters: 45, gybeCount: 4 })).toEqual(
      {
        ok: true,
        output: { distanceLostNm: 0.38876889848812096 },
      },
    ));

  it.each([
    [1, 10, 1, 10 / 1852],
    [10, 15, 5, 750 / 1852],
    [3, 20, 0, 0],
  ])(
    "converts boat lengths lost into nautical miles",
    (gybeCount, boatLengthMeters, boatLengthsLostPerGybe, expected) => {
      expect(
        calculateGybeLossDistance({
          boatLengthMeters,
          boatLengthsLostPerGybe,
          gybeCount,
        }),
      ).toEqual({ distanceLostNm: expected });
    },
  );

  it("scales linearly with gybe count", () => {
    const one = calculateGybeLossDistance({
      boatLengthMeters: 50,
      gybeCount: 1,
    });
    const three = calculateGybeLossDistance({
      boatLengthMeters: 50,
      gybeCount: 3,
    });
    expect(three.distanceLostNm).toBe(one.distanceLostNm * 3);
  });

  it("returns zero loss for no gybes and rejects negative counts", () => {
    expect(runGybeLossDistance({ boatLengthMeters: 45, gybeCount: 0 })).toEqual(
      {
        ok: true,
        output: { distanceLostNm: 0 },
      },
    );
    expect(
      runGybeLossDistance({ boatLengthMeters: 45, gybeCount: -1 }).ok,
    ).toBe(false);
  });

  it("rejects non-positive boat lengths with invalid_length", () => {
    const result = runGybeLossDistance({ boatLengthMeters: -5, gybeCount: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_length");
  });

  it("rejects losses outside zero to ten boat lengths", () => {
    for (const boatLengthsLostPerGybe of [-1, 11])
      expect(
        runGybeLossDistance({
          boatLengthMeters: 45,
          boatLengthsLostPerGybe,
          gybeCount: 2,
        }).ok,
      ).toBe(false);
  });

  it("rejects fractional and missing gybe counts", () => {
    expect(
      runGybeLossDistance({ boatLengthMeters: 45, gybeCount: 1.5 }).ok,
    ).toBe(false);
    expect(runGybeLossDistance({ boatLengthMeters: 45 }).ok).toBe(false);
  });

  it("rejects non-finite input", () =>
    expect(
      runGybeLossDistance({
        boatLengthMeters: Number.NaN,
        gybeCount: 2,
      }).ok,
    ).toBe(false));
});
