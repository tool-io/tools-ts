import { describe, expect, it } from "vitest";
import { runEtaFromDeparture } from "./tool.js";
describe("ETA From Departure Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runEtaFromDeparture({ departureTime: "14:45", flightTimeMinutes: 90 }),
    ).toEqual({ ok: true, output: { arrivalMinuteOfDay: 975, eta: "16:15" } }));
  it("wraps past midnight", () =>
    expect(
      runEtaFromDeparture({ departureTime: "23:30", flightTimeMinutes: 45 }),
    ).toEqual({ ok: true, output: { arrivalMinuteOfDay: 15, eta: "00:15" } }));
  it("lands exactly on midnight", () =>
    expect(
      runEtaFromDeparture({ departureTime: "23:00", flightTimeMinutes: 60 }),
    ).toEqual({ ok: true, output: { arrivalMinuteOfDay: 0, eta: "00:00" } }));
  it("departs at midnight", () =>
    expect(
      runEtaFromDeparture({ departureTime: "00:00", flightTimeMinutes: 1 }),
    ).toEqual({ ok: true, output: { arrivalMinuteOfDay: 1, eta: "00:01" } }));
  it("wraps multi-day flight times", () =>
    expect(
      runEtaFromDeparture({
        departureTime: "12:00",
        flightTimeMinutes: 2880,
      }),
    ).toEqual({ ok: true, output: { arrivalMinuteOfDay: 720, eta: "12:00" } }));
  it("rounds fractional minutes to the nearest displayed minute", () =>
    expect(
      runEtaFromDeparture({
        departureTime: "10:00",
        flightTimeMinutes: 90.5,
      }),
    ).toEqual({ ok: true, output: { arrivalMinuteOfDay: 691, eta: "11:31" } }));
  it("rejects invalid times", () => {
    for (const departureTime of ["24:00", "7:15", "12:60", "ab:cd", ""]) {
      const result = runEtaFromDeparture({
        departureTime,
        flightTimeMinutes: 30,
      });
      expect(result.ok).toBe(false);
      if (result.ok) throw new Error("Expected failure.");
      expect(result.error.issues[0]?.code).toBe("invalid_time");
    }
  });
  it("rejects zero flight time", () =>
    expect(
      runEtaFromDeparture({ departureTime: "09:00", flightTimeMinutes: 0 }).ok,
    ).toBe(false));
  it("rejects negative flight time", () =>
    expect(
      runEtaFromDeparture({ departureTime: "09:00", flightTimeMinutes: -5 }).ok,
    ).toBe(false));
});
