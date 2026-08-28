import { describe, expect, it } from "vitest";
import { mosfetSwitchingLossExample, runMosfetSwitchingLoss } from "./tool.js";

describe("MOSFET Switching Loss", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runMosfetSwitchingLoss(mosfetSwitchingLossExample.input)).toEqual({
      ok: true,
      output: mosfetSwitchingLossExample.output,
    }));

  it("computes 0.15000000000000002 W for a smaller hard-switched part", () =>
    expect(
      runMosfetSwitchingLoss({
        supplyVolts: 12,
        drainCurrentA: 1,
        triseNs: 20,
        tfallNs: 30,
        switchingFreqKhz: 500,
      }),
    ).toEqual({
      ok: true,
      output: { switchingLossWatts: 0.15000000000000002 },
    }));

  it("returns zero loss for zero drain current", () =>
    expect(
      runMosfetSwitchingLoss({
        supplyVolts: 24,
        drainCurrentA: 0,
        triseNs: 50,
        tfallNs: 40,
        switchingFreqKhz: 100,
      }),
    ).toEqual({ ok: true, output: { switchingLossWatts: 0 } }));

  it("doubles the loss when the frequency doubles", () => {
    const base = runMosfetSwitchingLoss({
      supplyVolts: 48,
      drainCurrentA: 10,
      triseNs: 25,
      tfallNs: 15,
      switchingFreqKhz: 20,
    });
    const faster = runMosfetSwitchingLoss({
      supplyVolts: 48,
      drainCurrentA: 10,
      triseNs: 25,
      tfallNs: 15,
      switchingFreqKhz: 40,
    });
    if (!base.ok || !faster.ok) throw new Error("expected success");
    expect(faster.output.switchingLossWatts).toBeCloseTo(
      Number(base.output.switchingLossWatts) * 2,
      15,
    );
  });

  it("rejects a non-positive supply voltage", () =>
    expect(
      runMosfetSwitchingLoss({
        supplyVolts: 0,
        drainCurrentA: 2,
        triseNs: 50,
        tfallNs: 40,
        switchingFreqKhz: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_supply", field: "supplyVolts" }] },
      ok: false,
    }));

  it("rejects a negative drain current", () =>
    expect(
      runMosfetSwitchingLoss({
        supplyVolts: 24,
        drainCurrentA: -1,
        triseNs: 50,
        tfallNs: 40,
        switchingFreqKhz: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "drainCurrentA" }] },
      ok: false,
    }));

  it("rejects a non-positive rise time", () =>
    expect(
      runMosfetSwitchingLoss({
        supplyVolts: 24,
        drainCurrentA: 2,
        triseNs: 0,
        tfallNs: 40,
        switchingFreqKhz: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_time", field: "triseNs" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runMosfetSwitchingLoss(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
