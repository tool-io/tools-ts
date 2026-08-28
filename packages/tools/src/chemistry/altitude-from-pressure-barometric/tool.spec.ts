import { describe, expect, it } from "vitest";
import { runAltitudeFromPressureBarometric } from "./tool.js";
describe("Altitude From Pressure", () => {
  it("calculates a valid result", () =>
    expect(
      runAltitudeFromPressureBarometric({
        pressureHpa: 850,
        temperatureK: 288.15,
      }),
    ).toEqual({
      ok: true,
      output: { altitudeMeters: 1481.8172843621376 },
    }));
  it("rejects invalid input", () =>
    expect(
      runAltitudeFromPressureBarometric({
        pressureHpa: 0,
        temperatureK: 288.15,
      }).ok,
    ).toBe(false));
});
