import { describe, expect, it } from "vitest";
import {
  calculateVoltSecondBalance,
  runVoltSecondBalance,
  voltSecondBalanceExample,
} from "./tool.js";

describe("Volt-Second Balance Check", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVoltSecondBalance(voltSecondBalanceExample.input)).toEqual({
      ok: true,
      output: voltSecondBalanceExample.output,
    });
  });

  it("flags imbalance above the five percent threshold as unbalanced", () => {
    expect(
      runVoltSecondBalance({
        tOffNs: 2700,
        tOnNs: 5000,
        vOffVolts: 20,
        vOnVolts: 12,
      }),
    ).toEqual({
      ok: true,
      output: { balanced: false, voltSecondImbalanceFraction: 0.1 },
    });
  });

  it("marks exactly five percent as unbalanced", () => {
    expect(
      calculateVoltSecondBalance({
        tOffNs: 2850,
        tOnNs: 5000,
        vOffVolts: 20,
        vOnVolts: 12,
      }).balanced,
    ).toBe(false);
  });

  it("marks just under five percent as balanced", () => {
    const result = calculateVoltSecondBalance({
      tOffNs: 2875,
      tOnNs: 5000,
      vOffVolts: 20,
      vOnVolts: 12,
    });
    expect(result.balanced).toBe(true);
    expect(result.voltSecondImbalanceFraction).toBeCloseTo(
      0.04166666666666667,
      15,
    );
  });

  it("computes the absolute normalized difference on an asymmetric case", () => {
    expect(
      calculateVoltSecondBalance({
        tOffNs: 1000,
        tOnNs: 2000,
        vOffVolts: 10,
        vOnVolts: 8,
      }).voltSecondImbalanceFraction,
    ).toBe(Math.abs(16000 - 10000) / 16000);
  });

  it("rejects non-positive voltages", () => {
    expect(
      runVoltSecondBalance({ ...voltSecondBalanceExample.input, vOnVolts: 0 })
        .ok,
    ).toBe(false);
    expect(
      runVoltSecondBalance({ ...voltSecondBalanceExample.input, vOffVolts: -1 })
        .ok,
    ).toBe(false);
  });

  it("rejects non-positive durations", () => {
    expect(
      runVoltSecondBalance({ ...voltSecondBalanceExample.input, tOnNs: 0 }).ok,
    ).toBe(false);
    expect(
      runVoltSecondBalance({ ...voltSecondBalanceExample.input, tOffNs: 0 }).ok,
    ).toBe(false);
  });
});
