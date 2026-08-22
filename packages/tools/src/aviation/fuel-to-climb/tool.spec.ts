import { describe, expect, it } from "vitest";
import {
  calculateFuelToClimb,
  runFuelToClimb,
  fuelToClimbExample,
} from "./tool.js";

describe("fuel to climb calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFuelToClimb(fuelToClimbExample.input)).toEqual({
      ok: true,
      output: fuelToClimbExample.output,
    });
  });

  it("scales with altitude and flow", () => {
    const higher = calculateFuelToClimb({
      altitudeToGainFt: 6000,
      climbRateFpm: 500,
      fuelFlowLitersPerHour: 40,
    }).fuelLiters;
    expect(higher).toBeCloseTo(fuelToClimbExample.output!.fuelLiters * 2, 9);
  });

  it("rejects invalid climb rates through execution", () => {
    expect(
      runFuelToClimb({
        altitudeToGainFt: 1000,
        climbRateFpm: 0,
        fuelFlowLitersPerHour: 40,
      }).ok,
    ).toBe(false);
  });
});
