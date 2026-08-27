import { describe, expect, it } from "vitest";
import {
  runVentilationPerfusionRatio,
  ventilationPerfusionRatioExample,
} from "./tool.js";

describe("V/Q Ratio", () => {
  it("publishes an executable example", () =>
    expect(
      runVentilationPerfusionRatio(ventilationPerfusionRatioExample.input),
    ).toEqual({ ok: true, output: ventilationPerfusionRatioExample.output }));
  it("computes a high V/Q unit", () =>
    expect(
      runVentilationPerfusionRatio({
        alveolarVentilationLPerMin: 8,
        pulmonaryBloodFlowLPerMin: 4,
      }),
    ).toEqual({ ok: true, output: { ventilationPerfusionRatio: 2 } }));
  it("computes a low V/Q unit", () =>
    expect(
      runVentilationPerfusionRatio({
        alveolarVentilationLPerMin: 1,
        pulmonaryBloodFlowLPerMin: 4,
      }),
    ).toEqual({ ok: true, output: { ventilationPerfusionRatio: 0.25 } }));
  it("accepts zero ventilation", () =>
    expect(
      runVentilationPerfusionRatio({
        alveolarVentilationLPerMin: 0,
        pulmonaryBloodFlowLPerMin: 5,
      }),
    ).toEqual({ ok: true, output: { ventilationPerfusionRatio: 0 } }));
  it("keeps fractional precision", () =>
    expect(
      runVentilationPerfusionRatio({
        alveolarVentilationLPerMin: 5.1,
        pulmonaryBloodFlowLPerMin: 6,
      }),
    ).toEqual({ ok: true, output: { ventilationPerfusionRatio: 0.85 } }));
  it("rejects non-positive blood flow", () => {
    const result = runVentilationPerfusionRatio({
      alveolarVentilationLPerMin: 4,
      pulmonaryBloodFlowLPerMin: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("pulmonaryBloodFlowLPerMin");
  });
  it("rejects negative blood flow", () => {
    const result = runVentilationPerfusionRatio({
      alveolarVentilationLPerMin: 4,
      pulmonaryBloodFlowLPerMin: -5,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects unknown fields", () => {
    const result = runVentilationPerfusionRatio({
      alveolarVentilationLPerMin: 4,
      pulmonaryBloodFlowLPerMin: 5,
      units: "L/min",
    });
    expect(result.ok).toBe(false);
  });
});
