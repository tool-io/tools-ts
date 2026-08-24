import { describe, expect, it } from "vitest";
import {
  calculateLinesPerHourPackStation,
  linesPerHourPackStationExample,
  runLinesPerHourPackStation,
} from "./tool.js";

describe("lines-per-hour-pack-station", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLinesPerHourPackStation(linesPerHourPackStationExample.input),
    ).toEqual({
      ok: true,
      output: linesPerHourPackStationExample.output,
    });
  });

  it("handles fractional hours", () => {
    expect(
      runLinesPerHourPackStation({ linesPacked: 120, stationHours: 1.5 }),
    ).toEqual({ ok: true, output: { linesPerHour: 80 } });
  });

  it("rejects zero station hours", () => {
    const result = runLinesPerHourPackStation({
      linesPacked: 10,
      stationHours: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "stationHours",
    });
  });

  it("rejects invalid counts and overflowing throughput", () => {
    expect(() =>
      calculateLinesPerHourPackStation({
        linesPacked: 1.5,
        stationHours: 1,
      }),
    ).toThrow("safe integer");
    expect(() =>
      calculateLinesPerHourPackStation({
        linesPacked: Number.MAX_SAFE_INTEGER,
        stationHours: Number.MIN_VALUE,
      }),
    ).toThrow("too large to represent");
  });
});
