import { describe, expect, it } from "vitest";
import {
  calculateTidalCurveInterpolation,
  runTidalCurveInterpolation,
  tidalCurveInterpolationExample,
} from "./tool.js";

describe("Tidal Curve Height", () => {
  it("publishes an executable example", () =>
    expect(
      runTidalCurveInterpolation(tidalCurveInterpolationExample.input),
    ).toEqual({
      ok: true,
      output: tidalCurveInterpolationExample.output,
    }));

  it("returns the high water level at zero hours", () =>
    expect(
      runTidalCurveInterpolation({
        highWaterMeters: 4,
        hoursIntoInterval: 0,
        intervalHours: 6,
        lowWaterMeters: 1,
      }),
    ).toEqual({
      ok: true,
      output: { heightMeters: 4 },
    }));

  it("returns the low water level at the end of the interval", () =>
    expect(
      runTidalCurveInterpolation({
        highWaterMeters: 4,
        hoursIntoInterval: 6,
        intervalHours: 6,
        lowWaterMeters: 1,
      }),
    ).toEqual({
      ok: true,
      output: { heightMeters: 1 },
    }));

  it.each([
    [1, 4, 3, 6, 2.5],
    [2, 5, 4, 8, 3.5],
  ])(
    "interpolates the midpoint of the cosine curve",
    (
      lowWaterMeters,
      highWaterMeters,
      hoursIntoInterval,
      intervalHours,
      expected,
    ) => {
      expect(
        calculateTidalCurveInterpolation({
          highWaterMeters,
          hoursIntoInterval,
          intervalHours,
          lowWaterMeters,
        }),
      ).toEqual({ heightMeters: expected });
    },
  );

  it("interpolates symmetric quarter points of the cosine curve", () => {
    const first = calculateTidalCurveInterpolation({
      highWaterMeters: 4,
      hoursIntoInterval: 1.5,
      intervalHours: 6,
      lowWaterMeters: 1,
    });
    const third = calculateTidalCurveInterpolation({
      highWaterMeters: 4,
      hoursIntoInterval: 4.5,
      intervalHours: 6,
      lowWaterMeters: 1,
    });
    expect(first.heightMeters).toBe(3.560660171779821);
    expect(third.heightMeters).toBe(1.4393398282201788);
    expect(first.heightMeters + third.heightMeters).toBeCloseTo(5, 12);
  });

  it("rejects inconsistent high and low water levels", () =>
    expect(
      runTidalCurveInterpolation({
        highWaterMeters: 2,
        hoursIntoInterval: 3,
        intervalHours: 6,
        lowWaterMeters: 4,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_levels" }] },
      ok: false,
    }));

  it("rejects non-positive intervals", () => {
    const result = runTidalCurveInterpolation({
      highWaterMeters: 4,
      hoursIntoInterval: 3,
      intervalHours: 0,
      lowWaterMeters: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_interval");
  });

  it("rejects negative hours through validation and long hours with invalid_hours", () => {
    expect(
      runTidalCurveInterpolation({
        highWaterMeters: 4,
        hoursIntoInterval: -0.5,
        intervalHours: 6,
        lowWaterMeters: 1,
      }).ok,
    ).toBe(false);
    const result = runTidalCurveInterpolation({
      highWaterMeters: 4,
      hoursIntoInterval: 7,
      intervalHours: 6,
      lowWaterMeters: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_hours");
  });

  it("accepts hours equal to the interval bounds", () => {
    expect(
      runTidalCurveInterpolation({
        highWaterMeters: 4,
        hoursIntoInterval: 0,
        intervalHours: 6,
        lowWaterMeters: 1,
      }).ok,
    ).toBe(true);
    expect(
      runTidalCurveInterpolation({
        highWaterMeters: 4,
        hoursIntoInterval: 6,
        intervalHours: 6,
        lowWaterMeters: 1,
      }).ok,
    ).toBe(true);
  });

  it("rejects non-finite and malformed input", () => {
    expect(
      runTidalCurveInterpolation({
        highWaterMeters: Number.NaN,
        hoursIntoInterval: 3,
        intervalHours: 6,
        lowWaterMeters: 1,
      }).ok,
    ).toBe(false);
    expect(
      runTidalCurveInterpolation({
        highWaterMeters: 4,
        hoursIntoInterval: 3,
        intervalHours: 6,
      }).ok,
    ).toBe(false);
  });
});
