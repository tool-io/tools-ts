import { describe, expect, it } from "vitest";
import {
  convertTimeZones,
  runTimeZoneConverter,
  timeZoneConverterExample,
} from "./tool.js";

describe("Time Zone Converter", () => {
  it("reproduces its canonical PST conversion", () => {
    expect(runTimeZoneConverter(timeZoneConverterExample.input)).toEqual({
      ok: true,
      output: timeZoneConverterExample.output,
    });
  });

  it("applies date-specific daylight-saving offsets", () => {
    const winter = convertTimeZones({
      localDateTime: "2026-01-15 18:00",
      sourceTimeZone: "America/Los_Angeles",
      timeZones: ["Europe/Berlin"],
    });
    const summer = convertTimeZones({
      localDateTime: "2026-07-15 18:00",
      sourceTimeZone: "America/Los_Angeles",
      timeZones: ["Europe/Berlin"],
    });
    expect(winter.conversions).toEqual([
      "Europe/Berlin — 2026-01-16 03:00:00 (UTC+01:00)",
    ]);
    expect(summer.conversions).toEqual([
      "Europe/Berlin — 2026-07-16 03:00:00 (UTC+02:00)",
    ]);
  });

  it("supports 12-hour output and city aliases", () => {
    expect(
      convertTimeZones({
        format: "12-hour",
        localDateTime: "2026-01-15 18:00",
        sourceTimeZone: "Los Angeles",
        timeZones: ["Berlin"],
      }).conversions,
    ).toEqual(["Europe/Berlin — 2026-01-16 03:00:00 AM (UTC+01:00)"]);
  });

  it("rejects a local time skipped by the DST transition", () => {
    expect(
      runTimeZoneConverter({
        localDateTime: "2026-03-29 02:30",
        sourceTimeZone: "Europe/Berlin",
        timeZones: ["UTC"],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "nonexistent_local_time" }] },
      ok: false,
    });
  });

  it("can choose either occurrence of a repeated DST time", () => {
    const earlier = convertTimeZones({
      disambiguation: "earlier",
      localDateTime: "2026-10-25 02:30",
      sourceTimeZone: "Europe/Berlin",
      timeZones: ["UTC"],
    });
    const later = convertTimeZones({
      disambiguation: "later",
      localDateTime: "2026-10-25 02:30",
      sourceTimeZone: "Europe/Berlin",
      timeZones: ["UTC"],
    });
    expect(earlier.instantUtc).toBe("2026-10-25T00:30:00.000Z");
    expect(later.instantUtc).toBe("2026-10-25T01:30:00.000Z");
  });

  it("rejects ambiguous times when requested", () => {
    expect(
      runTimeZoneConverter({
        disambiguation: "reject",
        localDateTime: "2026-10-25 02:30",
        sourceTimeZone: "Europe/Berlin",
        timeZones: ["UTC"],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "ambiguous_local_time" }] },
      ok: false,
    });
  });

  it("defaults to the runtime's complete supported IANA zone list", () => {
    const result = convertTimeZones({
      localDateTime: "2026-01-15 18:00",
      sourceTimeZone: "UTC",
    });
    expect(result.conversions.length).toBeGreaterThan(100);
    expect(result.conversions.some((entry) => entry.startsWith("UTC —"))).toBe(
      true,
    );
    expect(
      result.conversions.some((entry) => entry.startsWith("Europe/Berlin —")),
    ).toBe(true);
  });

  it("rejects invalid dates, zones, and unknown fields", () => {
    expect(
      runTimeZoneConverter({
        localDateTime: "2026-02-30 18:00",
        sourceTimeZone: "UTC",
      }).ok,
    ).toBe(false);
    expect(
      runTimeZoneConverter({
        localDateTime: "2026-01-15 18:00",
        sourceTimeZone: "Moon/Sea_of_Tranquility",
      }).ok,
    ).toBe(false);
    expect(
      runTimeZoneConverter({
        extra: true,
        localDateTime: "2026-01-15 18:00",
        sourceTimeZone: "UTC",
      }).ok,
    ).toBe(false);
  });
});
