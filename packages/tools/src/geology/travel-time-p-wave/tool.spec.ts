import { describe, expect, it } from "vitest";
import { travelTimePWaveExample, runTravelTimePWave } from "./tool.js";

describe("travel-time-p-wave", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTravelTimePWave(travelTimePWaveExample.input)).toEqual({
      ok: true,
      output: travelTimePWaveExample.output,
    });
  });

  it("gives zero time at the epicenter", () => {
    const result = runTravelTimePWave({
      distanceKm: 0,
      pVelocityKmPerSecond: 6,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.timeSeconds).toBe(0);
  });
  it("rejects non-positive velocities", () => {
    expect(
      runTravelTimePWave({ distanceKm: 10, pVelocityKmPerSecond: 0 }).ok,
    ).toBe(false);
  });
});
