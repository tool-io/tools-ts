import { describe, expect, it } from "vitest";
import { runCrestFactor } from "./tool.js";
describe("Crest Factor", () => {
  it("calculates a valid result", () =>
    expect(
      runCrestFactor({ peakVoltageV: 14.142135623730951, rmsVoltageV: 10 }),
    ).toEqual({
      ok: true,
      output: { crestFactor: Math.SQRT2 },
    }));
  it("returns one for equal peak and rms", () =>
    expect(runCrestFactor({ peakVoltageV: 5, rmsVoltageV: 5 })).toEqual({
      ok: true,
      output: { crestFactor: 1 },
    }));
  it("supports negative peak voltage", () =>
    expect(runCrestFactor({ peakVoltageV: -10, rmsVoltageV: 10 }).ok).toBe(
      true,
    ));
  it("rejects zero rms voltage", () => {
    const result = runCrestFactor({ peakVoltageV: 10, rmsVoltageV: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "rmsVoltageV",
      });
  });
  it("rejects negative rms voltage", () => {
    const result = runCrestFactor({ peakVoltageV: 10, rmsVoltageV: -2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("rmsVoltageV");
  });
  it("rejects non-finite input", () =>
    expect(
      runCrestFactor({ peakVoltageV: Number.NaN, rmsVoltageV: 1 }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runCrestFactor({
      extra: 3,
      peakVoltageV: 1,
      rmsVoltageV: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runCrestFactor({ rmsVoltageV: 1 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runCrestFactor({ peakVoltageV: [], rmsVoltageV: 1 }).ok).toBe(
      false,
    ));
});
