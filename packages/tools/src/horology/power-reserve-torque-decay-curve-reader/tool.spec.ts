import { describe, expect, it } from "vitest";
import {
  readPowerReserveTorqueDecayCurve,
  runTorqueDecayCurve,
  torqueDecayCurveExample,
} from "./tool.js";

describe("power-reserve torque decay curve reader", () => {
  it("reproduces the canonical interpolation", () => {
    expect(runTorqueDecayCurve(torqueDecayCurveExample.input)).toEqual({
      ok: true,
      output: torqueDecayCurveExample.output,
    });
  });

  it("interpolates independently between two points", () => {
    expect(
      readPowerReserveTorqueDecayCurve({
        elapsedHours: [0, 10],
        readoutHour: 2.5,
        torqueValues: [8, 6],
      }).interpolatedTorque,
    ).toBe(7.5);
  });

  it("handles both curve endpoints", () => {
    const curve = {
      elapsedHours: [0, 5, 10],
      readoutHour: 0,
      torqueValues: [10, 8, 6],
    };
    expect(readPowerReserveTorqueDecayCurve(curve).interpolatedTorque).toBe(10);
    expect(
      readPowerReserveTorqueDecayCurve({ ...curve, readoutHour: 10 })
        .interpolatedTorque,
    ).toBe(6);
  });

  it("preserves a nonmonotonic torque increase", () => {
    expect(
      readPowerReserveTorqueDecayCurve({
        elapsedHours: [0, 5, 10],
        readoutHour: 5,
        torqueValues: [10, 11, 9],
      }).monotonicDecreasing,
    ).toBe(false);
  });

  it("rejects mismatched curve arrays", () => {
    expect(
      runTorqueDecayCurve({
        elapsedHours: [0, 5],
        readoutHour: 0,
        torqueValues: [10],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "curve_length_mismatch", field: "torqueValues" }],
      },
      ok: false,
    });
  });

  it("rejects a readout beyond the measured interval", () => {
    expect(
      runTorqueDecayCurve({
        elapsedHours: [0, 5],
        readoutHour: 6,
        torqueValues: [10, 8],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "readout_hour_out_of_range", field: "readoutHour" }],
      },
      ok: false,
    });
  });
});
