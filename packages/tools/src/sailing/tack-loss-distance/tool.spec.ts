import { describe, expect, it } from "vitest";
import {
  calculateTackLossDistance,
  runTackLossDistance,
  tackLossDistanceExample,
} from "./tool.js";

describe("Tack Loss Distance", () => {
  it("publishes an executable example", () =>
    expect(runTackLossDistance(tackLossDistanceExample.input)).toEqual({
      ok: true,
      output: tackLossDistanceExample.output,
    }));

  it("applies the default four boat lengths lost per tack", () =>
    expect(runTackLossDistance({ boatLengthMeters: 40, tackCount: 6 })).toEqual(
      {
        ok: true,
        output: { distanceLostNm: 0.5183585313174947 },
      },
    ));

  it("honours an explicit loss per tack", () =>
    expect(
      runTackLossDistance({
        boatLengthMeters: 10,
        boatLengthsLostPerTack: 2,
        tackCount: 5,
      }),
    ).toEqual({
      ok: true,
      output: { distanceLostNm: 100 / 1852 },
    }));

  it("accepts a single tack and zero loss", () => {
    expect(runTackLossDistance({ boatLengthMeters: 12, tackCount: 1 })).toEqual(
      {
        ok: true,
        output: { distanceLostNm: 48 / 1852 },
      },
    );
    expect(
      runTackLossDistance({
        boatLengthMeters: 12,
        boatLengthsLostPerTack: 0,
        tackCount: 9,
      }),
    ).toEqual({
      ok: true,
      output: { distanceLostNm: 0 },
    });
  });

  it("grows linearly with tack count", () => {
    const few = calculateTackLossDistance({
      boatLengthMeters: 30,
      tackCount: 2,
    });
    const many = calculateTackLossDistance({
      boatLengthMeters: 30,
      tackCount: 8,
    });
    expect(many.distanceLostNm).toBe(few.distanceLostNm * 4);
  });

  it("rejects zero or negative tack counts", () => {
    for (const tackCount of [0, -2])
      expect(runTackLossDistance({ boatLengthMeters: 40, tackCount }).ok).toBe(
        false,
      );
  });

  it("rejects fractional tack counts", () =>
    expect(
      runTackLossDistance({ boatLengthMeters: 40, tackCount: 2.5 }).ok,
    ).toBe(false));

  it("rejects non-positive boat lengths with invalid_length", () => {
    const result = runTackLossDistance({ boatLengthMeters: 0, tackCount: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_length");
  });

  it("rejects losses outside zero to ten boat lengths", () => {
    for (const boatLengthsLostPerTack of [-0.1, 10.5])
      expect(
        runTackLossDistance({
          boatLengthMeters: 40,
          boatLengthsLostPerTack,
          tackCount: 3,
        }).ok,
      ).toBe(false);
  });

  it("rejects non-finite and malformed input", () => {
    expect(
      runTackLossDistance({
        boatLengthMeters: Number.POSITIVE_INFINITY,
        tackCount: 3,
      }).ok,
    ).toBe(false);
    expect(runTackLossDistance({ tackCount: 3 }).ok).toBe(false);
  });
});
