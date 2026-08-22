import { describe, expect, it } from "vitest";
import { timeToClimbExample, runTimeToClimb } from "./tool.js";

describe("time to climb calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTimeToClimb(timeToClimbExample.input)).toEqual({
      ok: true,
      output: timeToClimbExample.output,
    });
  });

  it("is zero for zero altitude gain", () => {
    expect(runTimeToClimb({ altitudeToGainFt: 0, climbRateFpm: 500 })).toEqual({
      ok: true,
      output: { climbHours: 0 },
    });
  });

  it("rejects non-positive climb rates through execution", () => {
    expect(
      runTimeToClimb({ altitudeToGainFt: 1000, climbRateFpm: -500 }).ok,
    ).toBe(false);
  });
});
