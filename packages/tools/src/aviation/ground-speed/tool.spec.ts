import { describe, expect, it } from "vitest";
import { calculateGroundSpeed, groundSpeedExample, runGroundSpeed } from "./tool.js";

describe("ground speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGroundSpeed(groundSpeedExample.input)).toEqual({
      ok: true,
      output: groundSpeedExample.output,
    });
  });

  it("equals TAS in still air", () => {
    expect(
      runGroundSpeed({ trueAirspeedKt: 150, windAngleDeg: 0, windSpeedKt: 0 }),
    ).toEqual({ ok: true, output: { groundSpeedKt: 150 } });
  });

  it("adds full tailwinds and subtracts full headwinds", () => {
    expect(
      runGroundSpeed({
        trueAirspeedKt: 100,
        windAngleDeg: 180,
        windSpeedKt: 25,
      }),
    ).toEqual({ ok: true, output: { groundSpeedKt: 125 } });
    expect(
      runGroundSpeed({
        trueAirspeedKt: 100,
        windAngleDeg: 0,
        windSpeedKt: 25,
      }),
    ).toEqual({ ok: true, output: { groundSpeedKt: 75 } });
  });

  it("rejects crosswinds beyond TAS through execution", () => {
    expect(
      runGroundSpeed({
        trueAirspeedKt: 10,
        windAngleDeg: 90,
        windSpeedKt: 40,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "wind_exceeds_airspeed" }] },
      ok: false,
    });
  });
});
