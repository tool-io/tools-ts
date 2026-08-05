import { describe, expect, it } from "vitest";
import { clockExample, formatClock, runClock } from "./tool.js";

describe("Clock", () => {
  it("formats 12-hour and 24-hour time", () => {
    expect(formatClock("2026-08-05T16:05:09Z", "UTC", "24-hour")).toBe(
      "16:05:09",
    );
    expect(formatClock("2026-08-05T16:05:09Z", "UTC", "12-hour")).toBe(
      "04:05:09 PM",
    );
  });

  it("rejects invalid instants and time zones", () => {
    expect(
      runClock({ format: "24-hour", instant: "invalid", timeZone: "UTC" }).ok,
    ).toBe(false);
    expect(
      runClock({
        format: "24-hour",
        instant: "2026-08-05T16:05:09Z",
        timeZone: "Invalid/Zone",
      }).ok,
    ).toBe(false);
  });

  it("publishes an executable example", () =>
    expect(runClock(clockExample.input)).toEqual({
      ok: true,
      output: clockExample.output,
    }));
});
