import { describe, expect, it } from "vitest";
import { runDbvToVolts } from "./tool.js";

const output = (result: ReturnType<typeof runDbvToVolts>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("dBV To Volts", () => {
  it("maps 0 dBV to exactly 1 V", () =>
    expect(runDbvToVolts({ dbv: 0 })).toEqual({
      ok: true,
      output: { voltsRms: 1 },
    }));
  it("maps +20 dBV to 10 V", () =>
    expect(output(runDbvToVolts({ dbv: 20 })).voltsRms).toBeCloseTo(10, 12));
  it("maps -20 dBV to 0.1 V", () =>
    expect(output(runDbvToVolts({ dbv: -20 })).voltsRms).toBeCloseTo(0.1, 12));
  it("maps +6 dBV to roughly 2 V", () =>
    expect(output(runDbvToVolts({ dbv: 6 })).voltsRms).toBeCloseTo(
      1.9952623149688795,
      12,
    ));
  it("maps -60 dBV to one millivolt", () =>
    expect(output(runDbvToVolts({ dbv: -60 })).voltsRms).toBeCloseTo(
      0.001,
      15,
    ));
  it("rejects non-finite levels", () =>
    expect(runDbvToVolts({ dbv: Number.NaN }).ok).toBe(false));
  it("rejects infinite levels", () =>
    expect(runDbvToVolts({ dbv: Number.NEGATIVE_INFINITY }).ok).toBe(false));
});
