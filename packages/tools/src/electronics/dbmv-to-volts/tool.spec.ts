import { describe, expect, it } from "vitest";
import { runDbmvToVolts } from "./tool.js";

const output = (result: ReturnType<typeof runDbmvToVolts>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("dBmV To Volts", () => {
  it("maps 0 dBmV to exactly 1 mV", () =>
    expect(runDbmvToVolts({ dbmv: 0 })).toEqual({
      ok: true,
      output: { volts: 0.001 },
    }));
  it("maps +60 dBmV to 1 V", () =>
    expect(output(runDbmvToVolts({ dbmv: 60 })).volts).toBeCloseTo(1, 12));
  it("maps +20 dBmV to 10 mV", () =>
    expect(output(runDbmvToVolts({ dbmv: 20 })).volts).toBeCloseTo(0.01, 12));
  it("maps -60 dBmV to one microvolt", () =>
    expect(output(runDbmvToVolts({ dbmv: -60 })).volts).toBeCloseTo(1e-6, 15));
  it("maps +120 dBmV to 1000 V", () =>
    expect(output(runDbmvToVolts({ dbmv: 120 })).volts).toBeCloseTo(1000, 9));
  it("rejects non-finite levels", () =>
    expect(runDbmvToVolts({ dbmv: Number.NaN }).ok).toBe(false));
  it("rejects infinite levels", () =>
    expect(runDbmvToVolts({ dbmv: Number.POSITIVE_INFINITY }).ok).toBe(false));
});
