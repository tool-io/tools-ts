import { describe, expect, it } from "vitest";
import {
  calculateFlightTime,
  flightTimeExample,
  runFlightTime,
} from "./tool.js";

describe("flight time calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFlightTime(flightTimeExample.input)).toEqual({
      ok: true,
      output: flightTimeExample.output,
    });
  });

  it("doubles with distance", () => {
    expect(
      calculateFlightTime({ distanceNm: 600, groundSpeedKt: 120 }),
    ).toEqual({
      flightHours: 5,
    });
  });

  it("rejects zero ground speed through execution", () => {
    expect(runFlightTime({ distanceNm: 100, groundSpeedKt: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_speed" }] },
      ok: false,
    });
  });
});
