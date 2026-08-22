import { describe, expect, it } from "vitest";
import { etaAtWaypointExample, runEtaAtWaypoint } from "./tool.js";

describe("eta at waypoint calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEtaAtWaypoint(etaAtWaypointExample.input)).toEqual({
      ok: true,
      output: etaAtWaypointExample.output,
    });
  });

  it("arrives one hour after departure for sixty-knot miles", () => {
    expect(
      runEtaAtWaypoint({
        departureTime: "09:00",
        distanceNm: 60,
        groundSpeedKt: 60,
      }),
    ).toEqual({ ok: true, output: { elapsedMinutes: 60, eta: "10:00" } });
  });

  it("keeps fractional elapsed minutes in the output", () => {
    const result = runEtaAtWaypoint({
      departureTime: "21:10",
      distanceNm: 100,
      groundSpeedKt: 90,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.elapsedMinutes).toBeCloseTo((100 / 90) * 60, 12);
    expect(result.output.eta).toBe("22:16");
  });

  it("wraps arrivals past midnight onto the next day clock", () => {
    expect(
      runEtaAtWaypoint({
        departureTime: "23:30",
        distanceNm: 90,
        groundSpeedKt: 120,
      }),
    ).toEqual({ ok: true, output: { elapsedMinutes: 45, eta: "00:15" } });
  });

  it("floors partial minutes toward the earlier minute", () => {
    const result = runEtaAtWaypoint({
      departureTime: "12:00",
      distanceNm: 101,
      groundSpeedKt: 120,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.elapsedMinutes).toBe(50.5);
    expect(result.output.eta).toBe("12:50");
  });

  it("accepts the earliest and latest times of day", () => {
    expect(
      runEtaAtWaypoint({
        departureTime: "00:00",
        distanceNm: 30,
        groundSpeedKt: 60,
      }),
    ).toMatchObject({ ok: true });
    expect(
      runEtaAtWaypoint({
        departureTime: "23:59",
        distanceNm: 30,
        groundSpeedKt: 60,
      }),
    ).toMatchObject({ ok: true });
  });

  it("rejects malformed departure times", () => {
    for (const departureTime of ["24:00", "7:45", "12:60", "ab:cd", ""]) {
      const result = runEtaAtWaypoint({
        departureTime,
        distanceNm: 50,
        groundSpeedKt: 100,
      });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_time");
    }
  });

  it("rejects non-positive distances", () => {
    const result = runEtaAtWaypoint({
      departureTime: "08:00",
      distanceNm: 0,
      groundSpeedKt: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_distance");
  });

  it("rejects zero ground speeds with the structured code", () => {
    const result = runEtaAtWaypoint({
      departureTime: "08:00",
      distanceNm: 50,
      groundSpeedKt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_ground_speed");
  });

  it("rejects negative ground speeds at the schema boundary", () => {
    expect(
      runEtaAtWaypoint({
        departureTime: "08:00",
        distanceNm: 50,
        groundSpeedKt: -5,
      }),
    ).toMatchObject({ ok: false });
  });

  it("rejects missing and unknown fields", () => {
    expect(
      runEtaAtWaypoint({ distanceNm: 50, groundSpeedKt: 100 }),
    ).toMatchObject({ ok: false });
    expect(
      runEtaAtWaypoint({
        departureTime: "08:00",
        distanceNm: 50,
        groundSpeedKt: 100,
        wind: 5,
      }),
    ).toMatchObject({ ok: false });
  });
});
