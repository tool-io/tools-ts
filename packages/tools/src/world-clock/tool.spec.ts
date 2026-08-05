import { describe, expect, it } from "vitest";
import { formatWorldClock, runWorldClock, worldClockExample } from "./tool.js";

describe("World Clock", () => {
  it("formats one instant across the selected locations", () => {
    expect(
      formatWorldClock("2026-08-05T23:05:09Z", "24-hour", [
        { name: "UTC", timeZone: "UTC" },
        { name: "Tokyo", timeZone: "Asia/Tokyo" },
      ]),
    ).toBe("UTC: 2026-08-05 23:05:09\nTokyo: 2026-08-06 08:05:09");
  });

  it("supports 12-hour time", () =>
    expect(
      formatWorldClock("2026-08-05T23:05:09Z", "12-hour", [
        { name: "UTC", timeZone: "UTC" },
      ]),
    ).toBe("UTC: 2026-08-05 11:05:09 PM"));

  it("rejects invalid input", () => {
    expect(runWorldClock({ format: "24-hour", instant: "invalid" }).ok).toBe(
      false,
    );
    expect(runWorldClock({ format: "invalid", instant: "2026-08-05" }).ok).toBe(
      false,
    );
  });

  it("publishes an executable example", () =>
    expect(runWorldClock(worldClockExample.input)).toEqual({
      ok: true,
      output: worldClockExample.output,
    }));
});
