import { describe, expect, it } from "vitest";
import { calculateDaylight, runDaylight } from "./tool.js";

describe("daylightTool", () => {
  it("estimates roughly twelve hours at the equator near an equinox", () => {
    const result = calculateDaylight({
      date: "2026-03-20",
      latitudeDegrees: 0,
      longitudeDegrees: 0,
      utcOffsetHours: 0,
    });
    expect(result.status).toBe("normal");
    expect(result.daylightMinutes).toBeCloseTo(727, -1);
  });

  it("recognizes polar day", () => {
    expect(
      calculateDaylight({
        date: "2026-06-21",
        latitudeDegrees: 90,
        longitudeDegrees: 0,
        utcOffsetHours: 0,
      }).status,
    ).toBe("polar-day");
  });

  it("rejects impossible dates", () => {
    expect(
      runDaylight({
        date: "2026-02-30",
        latitudeDegrees: 0,
        longitudeDegrees: 0,
        utcOffsetHours: 0,
      }).ok,
    ).toBe(false);
  });
});
