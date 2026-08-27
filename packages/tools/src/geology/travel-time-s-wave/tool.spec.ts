import { describe, expect, it } from "vitest";
import { travelTimeSWaveExample, runTravelTimeSWave } from "./tool.js";

describe("travel-time-s-wave", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTravelTimeSWave(travelTimeSWaveExample.input)).toEqual({
      ok: true,
      output: travelTimeSWaveExample.output,
    });
  });

  it("takes longer than the P wave over the same path", () => {
    const sWave = runTravelTimeSWave({
      distanceKm: 100,
      sVelocityKmPerSecond: 3.5,
    });
    const pWave = runTravelTimeSWave({
      distanceKm: 100,
      sVelocityKmPerSecond: 6,
    });
    if (!sWave.ok || !pWave.ok) throw new Error("expected success");
    expect(sWave.output.timeSeconds as number).toBeGreaterThan(
      pWave.output.timeSeconds as number,
    );
  });
  it("rejects non-positive velocities", () => {
    expect(
      runTravelTimeSWave({ distanceKm: 10, sVelocityKmPerSecond: -1 }).ok,
    ).toBe(false);
  });
});
