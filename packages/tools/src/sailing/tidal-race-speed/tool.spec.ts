import { describe, expect, it } from "vitest";
import {
  calculateTidalRaceSpeed,
  runTidalRaceSpeed,
  tidalRaceSpeedExample,
} from "./tool.js";

describe("Tidal Race Speed Calculator", () => {
  it("publishes an executable example", () =>
    expect(runTidalRaceSpeed(tidalRaceSpeedExample.input)).toEqual({
      ok: true,
      output: tidalRaceSpeedExample.output,
    }));

  it.each([
    [3, 6, 5, 3.5999999999999996],
    [2.4, 4.1, 8.2, 1.2],
    [4, 5, 5, 4],
    [1, 10, 5, 2],
  ])(
    "scales the peak stream by the range ratio",
    (peakStreamKt, springRangeMeters, meanSpringRangeMeters, expected) => {
      expect(
        calculateTidalRaceSpeed({
          meanSpringRangeMeters,
          peakStreamKt,
          springRangeMeters,
        }),
      ).toEqual({
        raceSpeedKt: expected,
      });
    },
  );

  it("leaves the rate unchanged on a mean spring day", () =>
    expect(
      runTidalRaceSpeed({
        meanSpringRangeMeters: 4.7,
        peakStreamKt: 6.5,
        springRangeMeters: 4.7,
      }),
    ).toEqual({
      ok: true,
      output: { raceSpeedKt: 6.5 },
    }));

  it("doubles the rate when the range doubles", () => {
    const neap = calculateTidalRaceSpeed({
      meanSpringRangeMeters: 5,
      peakStreamKt: 3,
      springRangeMeters: 2,
    });
    const spring = calculateTidalRaceSpeed({
      meanSpringRangeMeters: 5,
      peakStreamKt: 3,
      springRangeMeters: 4,
    });
    expect(spring.raceSpeedKt).toBe(neap.raceSpeedKt * 2);
  });

  it("rejects non-positive local spring ranges", () => {
    const result = runTidalRaceSpeed({
      meanSpringRangeMeters: 5,
      peakStreamKt: 3,
      springRangeMeters: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_range");
  });

  it("rejects non-positive mean spring ranges", () => {
    const result = runTidalRaceSpeed({
      meanSpringRangeMeters: -5,
      peakStreamKt: 3,
      springRangeMeters: 6,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_mean_range");
  });

  it("rejects a negative reference peak stream", () => {
    const result = runTidalRaceSpeed({
      meanSpringRangeMeters: 5,
      peakStreamKt: -1,
      springRangeMeters: 6,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects non-finite input", () => {
    expect(
      runTidalRaceSpeed({
        meanSpringRangeMeters: 5,
        peakStreamKt: Number.NaN,
        springRangeMeters: 6,
      }).ok,
    ).toBe(false);
    expect(
      runTidalRaceSpeed({
        meanSpringRangeMeters: Number.POSITIVE_INFINITY,
        peakStreamKt: 3,
        springRangeMeters: 6,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing and malformed input", () => {
    expect(
      runTidalRaceSpeed({ meanSpringRangeMeters: 5, springRangeMeters: 6 }).ok,
    ).toBe(false);
    expect(
      runTidalRaceSpeed({
        meanSpringRangeMeters: 5,
        peakStreamKt: "3",
        springRangeMeters: 6,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown input fields", () =>
    expect(
      runTidalRaceSpeed({
        extra: true,
        meanSpringRangeMeters: 5,
        peakStreamKt: 3,
        springRangeMeters: 6,
      }).ok,
    ).toBe(false));
});
