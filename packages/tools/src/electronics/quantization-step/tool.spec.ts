import { describe, expect, it } from "vitest";
import { quantizationStepExample, runQuantizationStep } from "./tool.js";

describe("LSB Step Size", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runQuantizationStep(quantizationStepExample.input)).toEqual({
      ok: true,
      output: { lsbVoltage: 0.0048828125 },
    }));
  it("reports a half-scale step for a one-bit converter", () =>
    expect(runQuantizationStep({ bits: 1, fullScaleVolts: 1 })).toEqual({
      ok: true,
      output: { lsbVoltage: 0.5 },
    }));
  it("handles arbitrary full-scale voltages", () =>
    expect(runQuantizationStep({ bits: 8, fullScaleVolts: 3.3 })).toEqual({
      ok: true,
      output: { lsbVoltage: 0.012890625 },
    }));
  it("rejects zero full-scale voltage", () =>
    expect(runQuantizationStep({ bits: 10, fullScaleVolts: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative full-scale voltage", () =>
    expect(runQuantizationStep({ bits: 10, fullScaleVolts: -5 }).ok).toBe(
      false,
    ));
  it("rejects bits outside the supported range", () =>
    expect(runQuantizationStep({ bits: 33, fullScaleVolts: 5 }).ok).toBe(
      false,
    ));
  it("rejects fractional bit depths", () =>
    expect(runQuantizationStep({ bits: 1.5, fullScaleVolts: 5 })).toMatchObject(
      {
        error: { issues: [{ code: "invalid_field", field: "bits" }] },
        ok: false,
      },
    ));
  it("rejects missing required inputs", () =>
    expect(runQuantizationStep({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "fullScaleVolts" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runQuantizationStep({
        ...quantizationStepExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
