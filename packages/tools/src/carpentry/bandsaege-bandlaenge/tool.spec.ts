import { describe, expect, it } from "vitest";
import {
  bandsawBladeLengthExample,
  bandsawBladeLengthTool,
  runBandsawBladeLength,
} from "./tool.js";

describe("Bandsaw Blade Length Calculator", () => {
  it("computes the canonical example", () =>
    expect(runBandsawBladeLength(bandsawBladeLengthExample.input)).toEqual({
      ok: true,
      output: { bandLengthMillimeters: 1428.3185307179588 },
    }));

  it.each([
    [300, 250, 1385.3981633974481],
    [500, 180, 1565.4866776461627],
  ])(
    "doubles the wheel distance and wraps the wheels for %p/%p",
    (distance, diameter, expected) =>
      expect(
        runBandsawBladeLength({
          wheelDistanceMm: distance,
          wheelDiameterMm: diameter,
        }),
      ).toEqual({
        ok: true,
        output: { bandLengthMillimeters: expected },
      }),
  );

  it("stays finite for very short center distances", () =>
    expect(
      runBandsawBladeLength({ wheelDistanceMm: 0.001, wheelDiameterMm: 80 }),
    ).toEqual({
      ok: true,
      output: { bandLengthMillimeters: 251.32941228718346 },
    }));

  it("grows the blade length with the wheel distance", () => {
    const short = runBandsawBladeLength({
      wheelDistanceMm: 300,
      wheelDiameterMm: 200,
    });
    const long = runBandsawBladeLength({
      wheelDistanceMm: 450,
      wheelDiameterMm: 200,
    });
    expect(
      short.ok && long.ok && long.output.bandLengthMillimeters,
    ).toBeGreaterThan(1428.3185307179588);
  });

  it("rejects a zero wheel distance with a stable error", () =>
    expect(
      runBandsawBladeLength({ wheelDistanceMm: 0, wheelDiameterMm: 200 }),
    ).toEqual({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [
          {
            code: "must_be_positive",
            field: "wheelDistanceMm",
            message: "Wheel distance must be positive.",
          },
        ],
      },
    }));

  it("rejects non-positive wheel diameters", () => {
    expect(
      runBandsawBladeLength({ wheelDistanceMm: 400, wheelDiameterMm: 0 }).ok,
    ).toBe(false);
    expect(
      runBandsawBladeLength({ wheelDistanceMm: 400, wheelDiameterMm: -120 }).ok,
    ).toBe(false);
  });

  it("rejects missing and non-finite inputs", () => {
    expect(runBandsawBladeLength({ wheelDistanceMm: 400 }).ok).toBe(false);
    expect(
      runBandsawBladeLength({
        wheelDistanceMm: Number.POSITIVE_INFINITY,
        wheelDiameterMm: 200,
      }).ok,
    ).toBe(false);
    expect(
      runBandsawBladeLength({
        wheelDistanceMm: 400,
        wheelDiameterMm: Number.NaN,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric inputs", () =>
    expect(
      runBandsawBladeLength({
        wheelDistanceMm: "400",
        wheelDiameterMm: 200,
      } as never).ok,
    ).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runBandsawBladeLength({
      wheelDistanceMm: 400,
      wheelDiameterMm: 200,
      teeth: 14,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(bandsawBladeLengthExample))).toEqual(
      bandsawBladeLengthExample,
    );
    expect(bandsawBladeLengthTool.id).toBe("carpentry/bandsaege-bandlaenge");
    expect(bandsawBladeLengthTool.execution).toEqual({ kind: "pure" });
  });
});
