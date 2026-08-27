import { describe, expect, it } from "vitest";
import {
  capacitorDischargingVoltageExample,
  runCapacitorDischargingVoltage,
} from "./tool.js";

describe("RC Discharging Voltage", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runCapacitorDischargingVoltage(capacitorDischargingVoltageExample.input),
    ).toEqual({ ok: true, output: capacitorDischargingVoltageExample.output }));

  it("returns the full initial voltage at time zero", () =>
    expect(
      runCapacitorDischargingVoltage({
        capacitanceF: 0.001,
        initialVolts: 9,
        resistanceOhms: 1000,
        timeSeconds: 0,
      }),
    ).toEqual({ ok: true, output: { capacitorVoltage: 9 } }));

  it("keeps decaying after two time constants", () =>
    expect(
      runCapacitorDischargingVoltage({
        capacitanceF: 0.001,
        initialVolts: 9,
        resistanceOhms: 1000,
        timeSeconds: 6,
      }),
    ).toEqual({
      ok: true,
      output: { capacitorVoltage: 0.022308769589997227 },
    }));

  it("drops monotonically with elapsed time", () => {
    const early = runCapacitorDischargingVoltage({
      capacitanceF: 0.001,
      initialVolts: 9,
      resistanceOhms: 1000,
      timeSeconds: 1,
    });
    const late = runCapacitorDischargingVoltage({
      capacitanceF: 0.001,
      initialVolts: 9,
      resistanceOhms: 1000,
      timeSeconds: 2,
    });
    expect(early.ok).toBe(true);
    expect(late.ok).toBe(true);
    if (!early.ok || !late.ok) return;
    expect(late.output.capacitorVoltage).toBeLessThan(
      Number(early.output.capacitorVoltage),
    );
  });

  it("rejects zero resistance", () =>
    expect(
      runCapacitorDischargingVoltage({
        capacitanceF: 0.001,
        initialVolts: 9,
        resistanceOhms: 0,
        timeSeconds: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "resistanceOhms" }],
      },
      ok: false,
    }));

  it("rejects negative time", () =>
    expect(
      runCapacitorDischargingVoltage({
        capacitanceF: 0.001,
        initialVolts: 9,
        resistanceOhms: 1000,
        timeSeconds: -0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "timeSeconds" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(
      runCapacitorDischargingVoltage({
        initialVolts: 9,
        resistanceOhms: 1000,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "capacitanceF" }] },
      ok: false,
    }));
});
