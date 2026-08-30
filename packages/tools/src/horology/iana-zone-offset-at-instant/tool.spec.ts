import { describe, expect, it } from "vitest";
import {
  resolveWorldTimerZoneOffset,
  runWorldTimerZone,
  worldTimerZoneExample,
} from "./tool.js";

describe("IANA zone offset at instant", () => {
  it("reproduces the canonical UTC example", () => {
    expect(runWorldTimerZone(worldTimerZoneExample.input)).toEqual({
      ok: true,
      output: worldTimerZoneExample.output,
    });
  });

  it("resolves New York standard time", () => {
    expect(
      resolveWorldTimerZoneOffset({
        ianaTimeZone: "America/New_York",
        utcDateTime: "2025-01-15T12:00:00Z",
      }).utcOffsetMinutes,
    ).toBe(-300);
  });

  it("resolves New York daylight-saving time", () => {
    expect(
      resolveWorldTimerZoneOffset({
        ianaTimeZone: "America/New_York",
        utcDateTime: "2025-07-15T12:00:00Z",
      }).utcOffsetMinutes,
    ).toBe(-240);
  });

  it("resolves a positive zone offset", () => {
    expect(
      resolveWorldTimerZoneOffset({
        ianaTimeZone: "Asia/Tokyo",
        utcDateTime: "2025-01-15T12:00:00Z",
      }).utcOffsetMinutes,
    ).toBe(540);
  });

  it("rejects an invalid IANA zone", () => {
    expect(
      runWorldTimerZone({
        ianaTimeZone: "Mars/Olympus",
        utcDateTime: "2025-01-15T12:00:00Z",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_iana_time_zone", field: "ianaTimeZone" }],
      },
      ok: false,
    });
  });

  it("rejects an ambiguous date without an explicit UTC time", () => {
    expect(
      runWorldTimerZone({
        ianaTimeZone: "Etc/UTC",
        utcDateTime: "2025-01-15",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "instant_format_invalid", field: "utcDateTime" }],
      },
      ok: false,
    });
  });
});
