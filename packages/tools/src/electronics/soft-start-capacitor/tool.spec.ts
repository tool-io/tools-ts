import { describe, expect, it } from "vitest";
import { runSoftStartCapacitor } from "./tool.js";
describe("Soft-Start Cap Value", () => {
  it("calculates a one-volt reference case", () =>
    expect(
      runSoftStartCapacitor({
        iChargeUa: 10,
        softStartTimeMs: 10,
        targetVoltageVolts: 1,
      }),
    ).toEqual({
      ok: true,
      output: { softStartCapacitanceUf: 0.1 },
    }));
  it("scales with charging current and ramp time", () =>
    expect(
      runSoftStartCapacitor({
        iChargeUa: 100,
        softStartTimeMs: 50,
        targetVoltageVolts: 3.3,
      }),
    ).toEqual({
      ok: true,
      output: { softStartCapacitanceUf: 1.5151515151515151 },
    }));
  it("doubles when the ramp time doubles", () =>
    expect(
      runSoftStartCapacitor({
        iChargeUa: 20,
        softStartTimeMs: 20,
        targetVoltageVolts: 2,
      }),
    ).toEqual({
      ok: true,
      output: { softStartCapacitanceUf: 0.2 },
    }));
  it("rejects a zero soft-start time", () =>
    expect(
      runSoftStartCapacitor({
        iChargeUa: 10,
        softStartTimeMs: 0,
        targetVoltageVolts: 1,
      }).ok,
    ).toBe(false));
  it("rejects a zero charging current", () =>
    expect(
      runSoftStartCapacitor({
        iChargeUa: 0,
        softStartTimeMs: 10,
        targetVoltageVolts: 1,
      }).ok,
    ).toBe(false));
  it("rejects a zero target voltage", () =>
    expect(
      runSoftStartCapacitor({
        iChargeUa: 10,
        softStartTimeMs: 10,
        targetVoltageVolts: 0,
      }).ok,
    ).toBe(false));
});
