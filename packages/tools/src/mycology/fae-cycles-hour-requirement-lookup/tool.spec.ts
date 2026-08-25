import { describe, expect, it } from "vitest";
import { runFaeCyclesHourRequirementLookup } from "./tool.js";
describe("FAE Cycles Requirement", () => {
  it("is adequate at exactly four cycles per hour", () =>
    expect(
      runFaeCyclesHourRequirementLookup({
        fanCyclesInt: 12,
        observationHoursInt: 3,
        targetFanCyclesPerHour: 4,
      }),
    ).toEqual({
      ok: true,
      output: { fanCyclesPerHour: 4, meetsCycleTarget: true },
    }));
  it("is adequate above the target", () =>
    expect(
      runFaeCyclesHourRequirementLookup({
        fanCyclesInt: 16,
        observationHoursInt: 2,
        targetFanCyclesPerHour: 4,
      }),
    ).toEqual({
      ok: true,
      output: { fanCyclesPerHour: 8, meetsCycleTarget: true },
    }));
  it("is inadequate below the target", () =>
    expect(
      runFaeCyclesHourRequirementLookup({
        fanCyclesInt: 4,
        observationHoursInt: 2,
        targetFanCyclesPerHour: 4,
      }),
    ).toEqual({
      ok: true,
      output: { fanCyclesPerHour: 2, meetsCycleTarget: false },
    }));
  it("is inadequate with no cycles", () =>
    expect(
      runFaeCyclesHourRequirementLookup({
        fanCyclesInt: 0,
        observationHoursInt: 5,
        targetFanCyclesPerHour: 4,
      }),
    ).toEqual({
      ok: true,
      output: { fanCyclesPerHour: 0, meetsCycleTarget: false },
    }));
  it("handles fractional rates", () =>
    expect(
      runFaeCyclesHourRequirementLookup({
        fanCyclesInt: 6,
        observationHoursInt: 4,
        targetFanCyclesPerHour: 4,
      }),
    ).toEqual({
      ok: true,
      output: { fanCyclesPerHour: 1.5, meetsCycleTarget: false },
    }));
  it("supports single hour observations", () =>
    expect(
      runFaeCyclesHourRequirementLookup({
        fanCyclesInt: 5,
        observationHoursInt: 1,
        targetFanCyclesPerHour: 4,
      }),
    ).toEqual({
      ok: true,
      output: { fanCyclesPerHour: 5, meetsCycleTarget: true },
    }));
  it("rejects zero observation hours", () =>
    expect(
      runFaeCyclesHourRequirementLookup({
        fanCyclesInt: 4,
        observationHoursInt: 0,
        targetFanCyclesPerHour: 4,
      }).ok,
    ).toBe(false));
  it("rejects negative cycle counts", () =>
    expect(
      runFaeCyclesHourRequirementLookup({
        fanCyclesInt: -1,
        observationHoursInt: 2,
        targetFanCyclesPerHour: 4,
      }).ok,
    ).toBe(false));
});
