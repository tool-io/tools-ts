import { describe, expect, it } from "vitest";
import { runGrainSpawnColonizationDaysEstimator } from "./tool.js";
describe("Colonization Days Estimate", () => {
  it("calculates a valid result with the default spawn rate", () =>
    expect(
      runGrainSpawnColonizationDaysEstimator({
        daysPerLiterAtFullSpawn: 0.4,
        volumeL: 2,
      }),
    ).toEqual({
      ok: true,
      output: { estimatedColonizationDays: 8 },
    }));
  it("accepts an explicit spawn rate", () =>
    expect(
      runGrainSpawnColonizationDaysEstimator({
        volumeL: 5,
        daysPerLiterAtFullSpawn: 0.4,
        spawnRatePercent: 20,
      }),
    ).toEqual({ ok: true, output: { estimatedColonizationDays: 10 } }));
  it("shortens estimates at the maximum spawn rate", () =>
    expect(
      runGrainSpawnColonizationDaysEstimator({
        volumeL: 1,
        daysPerLiterAtFullSpawn: 0.4,
        spawnRatePercent: 50,
      }),
    ).toEqual({ ok: true, output: { estimatedColonizationDays: 0.8 } }));
  it("lengthens estimates at the minimum spawn rate", () =>
    expect(
      runGrainSpawnColonizationDaysEstimator({
        volumeL: 1,
        daysPerLiterAtFullSpawn: 0.4,
        spawnRatePercent: 1,
      }),
    ).toEqual({ ok: true, output: { estimatedColonizationDays: 40 } }));
  it("handles fractional volumes", () =>
    expect(
      runGrainSpawnColonizationDaysEstimator({
        daysPerLiterAtFullSpawn: 0.4,
        volumeL: 2.5,
      }),
    ).toEqual({
      ok: true,
      output: { estimatedColonizationDays: 10 },
    }));
  it("rejects zero volume", () =>
    expect(
      runGrainSpawnColonizationDaysEstimator({
        daysPerLiterAtFullSpawn: 0.4,
        volumeL: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative volume", () =>
    expect(
      runGrainSpawnColonizationDaysEstimator({
        daysPerLiterAtFullSpawn: 0.4,
        volumeL: -2,
      }).ok,
    ).toBe(false));
  it("rejects spawn rates below one percent", () =>
    expect(
      runGrainSpawnColonizationDaysEstimator({
        volumeL: 2,
        daysPerLiterAtFullSpawn: 0.4,
        spawnRatePercent: 0,
      }).ok,
    ).toBe(false));
  it("rejects spawn rates above fifty percent", () =>
    expect(
      runGrainSpawnColonizationDaysEstimator({
        volumeL: 2,
        daysPerLiterAtFullSpawn: 0.4,
        spawnRatePercent: 51,
      }).ok,
    ).toBe(false));
});
