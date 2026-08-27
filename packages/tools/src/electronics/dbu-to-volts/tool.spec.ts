import { describe, expect, it } from "vitest";
import { runDbuToVolts } from "./tool.js";

const output = (result: ReturnType<typeof runDbuToVolts>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("dBu To Volts", () => {
  it("maps 0 dBu to the 0.7746 V reference", () =>
    expect(runDbuToVolts({ dbu: 0 })).toEqual({
      ok: true,
      output: { voltsRms: 0.7746 },
    }));
  it("maps +4 dBu to professional line level", () =>
    expect(output(runDbuToVolts({ dbu: 4 })).voltsRms).toBeCloseTo(
      1.2276582668803786,
      12,
    ));
  it("maps -20 dBu a decade below the reference", () =>
    expect(output(runDbuToVolts({ dbu: -20 })).voltsRms).toBeCloseTo(
      0.07746,
      12,
    ));
  it("maps +20 dBu a decade above the reference", () =>
    expect(output(runDbuToVolts({ dbu: 20 })).voltsRms).toBeCloseTo(7.746, 12));
  it("accepts fractional levels such as -6 dBu", () =>
    expect(output(runDbuToVolts({ dbu: -6 })).voltsRms).toBeCloseTo(
      0.38821963116768504,
      12,
    ));
  it("rejects non-finite levels", () =>
    expect(runDbuToVolts({ dbu: Number.NaN }).ok).toBe(false));
  it("rejects infinite levels", () =>
    expect(runDbuToVolts({ dbu: Number.POSITIVE_INFINITY }).ok).toBe(false));
});
