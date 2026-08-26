import { describe, expect, it } from "vitest";
import {
  timeToWaypointSailingExample,
  runTimeToWaypointSailing,
} from "./tool.js";

describe("time to waypoint calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTimeToWaypointSailing(timeToWaypointSailingExample.input),
    ).toEqual({
      ok: true,
      output: timeToWaypointSailingExample.output,
    });
  });

  it("converts fractional distances and speeds to minutes", () => {
    const result = runTimeToWaypointSailing({ distanceNm: 2.5, speedKt: 5 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.timeMinutes).toBe(30);
  });

  it("scales linearly with distance", () => {
    const base = runTimeToWaypointSailing({ distanceNm: 3, speedKt: 7 });
    const doubled = runTimeToWaypointSailing({ distanceNm: 6, speedKt: 7 });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.timeMinutes).toBe(
      2 * (base.output.timeMinutes as number),
    );
  });

  it("returns sub-minute times for short distances", () => {
    const result = runTimeToWaypointSailing({ distanceNm: 0.1, speedKt: 6 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.timeMinutes).toBeCloseTo(1, 12);
  });

  it("rejects zero and negative distances with a stable code", () => {
    for (const distanceNm of [0, -2])
      expect(
        runTimeToWaypointSailing({ distanceNm, speedKt: 5 }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_input", field: "distanceNm" }] },
        ok: false,
      });
  });

  it("rejects zero and negative speeds with a stable code", () => {
    for (const speedKt of [0, -4])
      expect(
        runTimeToWaypointSailing({ distanceNm: 10, speedKt }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_input", field: "speedKt" }] },
        ok: false,
      });
  });

  it("rejects missing required inputs", () => {
    expect(runTimeToWaypointSailing({ speedKt: 5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "distanceNm" }] },
      ok: false,
    });
    expect(runTimeToWaypointSailing({})).toMatchObject({
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { distanceNm: Number.NaN, speedKt: 5 },
      { distanceNm: Number.POSITIVE_INFINITY, speedKt: 5 },
      { distanceNm: 10, speedKt: Number.NEGATIVE_INFINITY },
    ])
      expect(runTimeToWaypointSailing(bad).ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    expect(
      runTimeToWaypointSailing({
        currentKt: 1,
        distanceNm: 10,
        speedKt: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "currentKt" }] },
      ok: false,
    });
  });
});
