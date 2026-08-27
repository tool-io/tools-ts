import { describe, expect, it } from "vitest";
import { inputRippleVoltageExample, runInputRippleVoltage } from "./tool.js";

describe("Input Ripple Voltage", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runInputRippleVoltage(inputRippleVoltageExample.input)).toEqual({
      ok: true,
      output: inputRippleVoltageExample.output,
    }));

  it("returns zero ripple at a duty cycle of one", () =>
    expect(
      runInputRippleVoltage({
        iOutAmps: 2,
        dutyFraction: 1,
        capacitanceUf: 10,
        switchingFreqKhz: 500,
      }),
    ).toEqual({ ok: true, output: { inputRippleV: 0 } }));

  it("is symmetric around a duty cycle of one half", () => {
    const quarter = runInputRippleVoltage({
      iOutAmps: 1,
      dutyFraction: 0.25,
      capacitanceUf: 10,
      switchingFreqKhz: 100,
    });
    const threeQuarter = runInputRippleVoltage({
      iOutAmps: 1,
      dutyFraction: 0.75,
      capacitanceUf: 10,
      switchingFreqKhz: 100,
    });
    if (!quarter.ok || !threeQuarter.ok) throw new Error("expected success");
    expect(threeQuarter.output.inputRippleV).toBeCloseTo(
      Number(quarter.output.inputRippleV),
      15,
    );
  });

  it("halves the ripple when the input capacitance doubles", () => {
    const base = runInputRippleVoltage({
      iOutAmps: 3,
      dutyFraction: 0.4,
      capacitanceUf: 20,
      switchingFreqKhz: 250,
    });
    const doubled = runInputRippleVoltage({
      iOutAmps: 3,
      dutyFraction: 0.4,
      capacitanceUf: 40,
      switchingFreqKhz: 250,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.inputRippleV).toBeCloseTo(
      Number(base.output.inputRippleV) / 2,
      15,
    );
  });

  it("rejects a non-positive output current", () =>
    expect(
      runInputRippleVoltage({
        iOutAmps: 0,
        dutyFraction: 0.5,
        capacitanceUf: 10,
        switchingFreqKhz: 500,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "iOutAmps" }] },
      ok: false,
    }));

  it("rejects a non-positive capacitance", () =>
    expect(
      runInputRippleVoltage({
        iOutAmps: 2,
        dutyFraction: 0.5,
        capacitanceUf: -5,
        switchingFreqKhz: 500,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_capacitance", field: "capacitanceUf" }],
      },
      ok: false,
    }));

  it("rejects duty cycles outside the unit interval", () =>
    expect(
      runInputRippleVoltage({
        iOutAmps: 2,
        dutyFraction: -0.1,
        capacitanceUf: 10,
        switchingFreqKhz: 500,
      }),
    ).toMatchObject({
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_field", field: "dutyFraction" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runInputRippleVoltage(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
