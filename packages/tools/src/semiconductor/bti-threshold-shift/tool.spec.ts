import { describe, expect, it } from "vitest";
import {
  BOLTZ_EV_PER_K,
  btiThresholdShiftExample,
  runBtiThresholdShift,
} from "./tool.js";

describe("BTI Threshold Shift Calculator", () => {
  it("exposes the Boltzmann constant in eV per kelvin", () => {
    expect(BOLTZ_EV_PER_K).toBe(8.617333262e-5);
  });

  it("reproduces its canonical example exactly with defaults", () =>
    expect(runBtiThresholdShift(btiThresholdShiftExample.input)).toEqual({
      ok: true,
      output: { thresholdShiftMillivolts: 3033.1983769847016 },
    }));

  it("predicts zero shift at zero stress time", () =>
    expect(
      runBtiThresholdShift({ stressTimeHours: 0, temperatureKelvin: 398 }),
    ).toEqual({ ok: true, output: { thresholdShiftMillivolts: 0 } }));

  it("follows the quarter-power law in stress time at the reference temperature", () =>
    expect(
      runBtiThresholdShift({ stressTimeHours: 16, temperatureKelvin: 300 }),
    ).toEqual({ ok: true, output: { thresholdShiftMillivolts: 20 } }));

  it("accepts the lower schema boundary temperature", () =>
    expect(
      runBtiThresholdShift({ stressTimeHours: 1, temperatureKelvin: 250 }),
    ).toEqual({
      ok: true,
      output: { thresholdShiftMillivolts: 0.0964025952830983 },
    }));

  it("accepts the upper schema boundary temperature", () =>
    expect(
      runBtiThresholdShift({ stressTimeHours: 1, temperatureKelvin: 450 }),
    ).toEqual({
      ok: true,
      output: { thresholdShiftMillivolts: 22900.877497838745 },
    }));

  it("scales linearly with the prefactor", () =>
    expect(
      runBtiThresholdShift({
        prefactorMillivolts: 20,
        stressTimeHours: 1,
        temperatureKelvin: 398,
      }),
    ).toEqual({
      ok: true,
      output: { thresholdShiftMillivolts: 6066.396753969403 },
    }));

  it("rejects temperatures below the schema minimum", () =>
    expect(
      runBtiThresholdShift({ stressTimeHours: 1, temperatureKelvin: 249 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects temperatures above the schema maximum", () =>
    expect(
      runBtiThresholdShift({ stressTimeHours: 1, temperatureKelvin: 451 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects negative stress time below the schema minimum", () =>
    expect(
      runBtiThresholdShift({ stressTimeHours: -1, temperatureKelvin: 398 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "stressTimeHours" }] },
      ok: false,
    }));

  it("rejects non-finite stress time", () =>
    expect(
      runBtiThresholdShift({
        stressTimeHours: Number.POSITIVE_INFINITY,
        temperatureKelvin: 398,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "stressTimeHours" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runBtiThresholdShift({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "stressTimeHours" }] },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runBtiThresholdShift({
        extra: 1,
        stressTimeHours: 1,
        temperatureKelvin: 398,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
