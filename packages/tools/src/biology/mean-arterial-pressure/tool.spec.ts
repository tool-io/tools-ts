import { describe, expect, it } from "vitest";
import {
  meanArterialPressureExample,
  runMeanArterialPressure,
} from "./tool.js";

describe("MAP mmHg", () => {
  it("publishes an executable example", () =>
    expect(runMeanArterialPressure(meanArterialPressureExample.input)).toEqual({
      ok: true,
      output: meanArterialPressureExample.output,
    }));
  it("weights diastolic pressure over the pulse gap", () =>
    expect(
      runMeanArterialPressure({ diastolicMmHg: 60, systolicMmHg: 90 }),
    ).toEqual({ ok: true, output: { meanArterialPressure: 70 } }));
  it("computes another valid result", () =>
    expect(
      runMeanArterialPressure({ diastolicMmHg: 100, systolicMmHg: 150 }),
    ).toEqual({
      ok: true,
      output: { meanArterialPressure: 116.66666666666667 },
    }));
  it("rejects equal pressures", () => {
    const result = runMeanArterialPressure({
      diastolicMmHg: 80,
      systolicMmHg: 80,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_pressure");
  });
  it("rejects diastolic above systolic", () => {
    const result = runMeanArterialPressure({
      diastolicMmHg: 90,
      systolicMmHg: 80,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_pressure");
  });
  it("rejects unknown fields", () => {
    const result = runMeanArterialPressure({
      diastolicMmHg: 80,
      extra: 1,
      systolicMmHg: 120,
    });
    expect(result.ok).toBe(false);
  });
});
