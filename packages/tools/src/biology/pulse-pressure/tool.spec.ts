import { describe, expect, it } from "vitest";
import { pulsePressureExample, runPulsePressure } from "./tool.js";

describe("Pulse Pressure", () => {
  it("publishes an executable example", () =>
    expect(runPulsePressure(pulsePressureExample.input)).toEqual({
      ok: true,
      output: pulsePressureExample.output,
    }));
  it("subtracts diastolic from systolic pressure", () =>
    expect(runPulsePressure({ diastolicMmHg: 60, systolicMmHg: 90 })).toEqual({
      ok: true,
      output: { pulsePressure: 30 },
    }));
  it("computes another valid result", () =>
    expect(runPulsePressure({ diastolicMmHg: 100, systolicMmHg: 150 })).toEqual(
      { ok: true, output: { pulsePressure: 50 } },
    ));
  it("rejects equal pressures", () => {
    const result = runPulsePressure({ diastolicMmHg: 80, systolicMmHg: 80 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_pressure");
  });
  it("rejects inverted pressures", () => {
    const result = runPulsePressure({ diastolicMmHg: 120, systolicMmHg: 80 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_pressure");
  });
  it("rejects missing inputs", () => {
    const result = runPulsePressure({ systolicMmHg: 120 });
    expect(result.ok).toBe(false);
  });
});
