import { describe, expect, it } from "vitest";
import {
  capacitorChargingVoltageExample,
  runCapacitorChargingVoltage,
} from "./tool.js";

describe("RC Charging Voltage", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runCapacitorChargingVoltage(capacitorChargingVoltageExample.input),
    ).toEqual({ ok: true, output: capacitorChargingVoltageExample.output }));

  it("starts at zero volts at time zero", () =>
    expect(
      runCapacitorChargingVoltage({
        capacitanceF: 0.001,
        resistanceOhms: 1000,
        supplyVolts: 5,
        timeSeconds: 0,
      }),
    ).toEqual({ ok: true, output: { capacitorVoltage: 0 } }));

  it("rises monotonically with elapsed time", () => {
    const early = runCapacitorChargingVoltage({
      capacitanceF: 0.001,
      resistanceOhms: 1000,
      supplyVolts: 5,
      timeSeconds: 0.5,
    });
    const late = runCapacitorChargingVoltage({
      capacitanceF: 0.001,
      resistanceOhms: 1000,
      supplyVolts: 5,
      timeSeconds: 1,
    });
    expect(early.ok).toBe(true);
    expect(late.ok).toBe(true);
    if (!early.ok || !late.ok) return;
    expect(late.output.capacitorVoltage).toBeGreaterThan(
      Number(early.output.capacitorVoltage),
    );
  });

  it("approaches the supply voltage after many time constants", () => {
    const result = runCapacitorChargingVoltage({
      capacitanceF: 0.001,
      resistanceOhms: 1000,
      supplyVolts: 5,
      timeSeconds: 50,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.capacitorVoltage).toBeGreaterThan(4.999);
  });

  it("rejects zero resistance", () =>
    expect(
      runCapacitorChargingVoltage({
        capacitanceF: 0.001,
        resistanceOhms: 0,
        supplyVolts: 5,
        timeSeconds: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "resistanceOhms" }],
      },
      ok: false,
    }));

  it("rejects zero capacitance", () =>
    expect(
      runCapacitorChargingVoltage({
        capacitanceF: 0,
        resistanceOhms: 1000,
        supplyVolts: 5,
        timeSeconds: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "capacitanceF" }] },
      ok: false,
    }));

  it("rejects negative time", () =>
    expect(
      runCapacitorChargingVoltage({
        capacitanceF: 0.001,
        resistanceOhms: 1000,
        supplyVolts: 5,
        timeSeconds: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "timeSeconds" }] },
      ok: false,
    }));

  it("rejects a null input", () =>
    expect(runCapacitorChargingVoltage(null).ok).toBe(false));
});
