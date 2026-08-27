import { describe, expect, it } from "vitest";
import { runAverageRectifiedVoltage } from "./tool.js";
describe("Average Rectified Voltage", () => {
  it("calculates a valid result", () =>
    expect(runAverageRectifiedVoltage({ peakVoltageV: 10 })).toEqual({
      ok: true,
      output: { averageRectifiedVolts: 6.366197723675814 },
    }));
  it("converts pi peak to two volts", () =>
    expect(
      runAverageRectifiedVoltage({ peakVoltageV: 3.141592653589793 }),
    ).toEqual({
      ok: true,
      output: { averageRectifiedVolts: 2 },
    }));
  it("allows zero peak voltage", () =>
    expect(runAverageRectifiedVoltage({ peakVoltageV: 0 })).toEqual({
      ok: true,
      output: { averageRectifiedVolts: 0 },
    }));
  it("rejects negative peak voltage", () => {
    const result = runAverageRectifiedVoltage({ peakVoltageV: -5 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "peakVoltageV",
      });
  });
  it("rejects non-finite input", () =>
    expect(
      runAverageRectifiedVoltage({
        peakVoltageV: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runAverageRectifiedVoltage({ extra: 2, peakVoltageV: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runAverageRectifiedVoltage({}).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runAverageRectifiedVoltage({ peakVoltageV: null }).ok).toBe(false));
});
