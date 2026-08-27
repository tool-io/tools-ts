import { describe, expect, it } from "vitest";
import { runFormFactor } from "./tool.js";
describe("Form Factor", () => {
  it("calculates a valid result", () =>
    expect(runFormFactor({ peakVoltageV: 10 })).toEqual({
      ok: true,
      output: { formFactor: 1.1107207345395913 },
    }));
  it("equals the sinusoid constant", () => {
    const result = runFormFactor({ peakVoltageV: 10 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.formFactor).toBeCloseTo(
        Math.PI / (2 * Math.SQRT2),
        12,
      );
  });
  it("is independent of peak voltage scale", () => {
    const result = runFormFactor({ peakVoltageV: 0.001 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.formFactor).toBeGreaterThan(1.11);
  });
  it("rejects zero peak voltage", () => {
    const result = runFormFactor({ peakVoltageV: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "peakVoltageV",
      });
  });
  it("rejects negative peak voltage", () => {
    const result = runFormFactor({ peakVoltageV: -10 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("peakVoltageV");
  });
  it("rejects non-finite input", () =>
    expect(runFormFactor({ peakVoltageV: Number.POSITIVE_INFINITY }).ok).toBe(
      false,
    ));
  it("rejects an unknown field", () => {
    const result = runFormFactor({ extra: 2, peakVoltageV: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runFormFactor({}).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runFormFactor({ peakVoltageV: "10" }).ok).toBe(false));
});
