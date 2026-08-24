import { describe, expect, it } from "vitest";
import {
  calculateMarketHours,
  marketHoursExample,
  runMarketHours,
} from "./tool.js";

describe("Trading Market Hours", () => {
  it("reproduces the regular winter-session example", () => {
    expect(runMarketHours(marketHoursExample.input)).toEqual({
      ok: true,
      output: marketHoursExample.output,
    });
  });

  it("adjusts the sessions and overlaps for summer time", () => {
    const result = calculateMarketHours({
      date: "2026-07-15",
      displayTimeZone: "UTC",
    });
    expect(result.sessions).toEqual([
      "Sydney (Australia/Sydney) — 2026-07-14 22:00:00 (UTC+00:00) – 2026-07-15 07:00:00 (UTC+00:00)",
      "Tokyo (Asia/Tokyo) — 2026-07-15 00:00:00 (UTC+00:00) – 2026-07-15 09:00:00 (UTC+00:00)",
      "London (Europe/London) — 2026-07-15 07:00:00 (UTC+00:00) – 2026-07-15 16:00:00 (UTC+00:00)",
      "New York (America/New_York) — 2026-07-15 12:00:00 (UTC+00:00) – 2026-07-15 21:00:00 (UTC+00:00)",
    ]);
    expect(result.overlaps).toEqual([
      "Sydney / Tokyo — 2026-07-15 00:00:00 (UTC+00:00) – 2026-07-15 07:00:00 (UTC+00:00)",
      "Tokyo / London — 2026-07-15 07:00:00 (UTC+00:00) – 2026-07-15 09:00:00 (UTC+00:00)",
      "London / New York — 2026-07-15 12:00:00 (UTC+00:00) – 2026-07-15 16:00:00 (UTC+00:00)",
    ]);
  });

  it("displays every session in the requested zone", () => {
    const result = calculateMarketHours({
      date: "2026-01-15",
      displayTimeZone: "Berlin",
      format: "12-hour",
    });
    expect(result.displayTimeZone).toBe("Europe/Berlin");
    expect(result.sessions[2]).toBe(
      "London (Europe/London) — 2026-01-15 09:00:00 AM (UTC+01:00) – 2026-01-15 06:00:00 PM (UTC+01:00)",
    );
  });

  it("marks every regular session closed on weekends", () => {
    const result = calculateMarketHours({
      date: "2026-01-17",
      displayTimeZone: "UTC",
    });
    expect(result.sessions).toHaveLength(4);
    expect(
      result.sessions.every((session) => session.endsWith("weekend")),
    ).toBe(true);
    expect(result.overlaps).toEqual([
      "No regular session overlaps: the selected trading date is a weekend.",
    ]);
  });

  it("rejects invalid dates and display zones", () => {
    expect(
      runMarketHours({
        date: "2026-02-30",
        displayTimeZone: "UTC",
      }).ok,
    ).toBe(false);
    expect(
      runMarketHours({
        date: "2026-01-15",
        displayTimeZone: "Mars/Olympus_Mons",
      }).ok,
    ).toBe(false);
  });

  it("rejects unsupported input fields", () => {
    expect(
      runMarketHours({
        date: "2026-01-15",
        displayTimeZone: "UTC",
        exchangeHolidayCalendar: true,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
  });
});
