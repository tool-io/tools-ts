import { describe, expect, it } from "vitest";
import {
  calculateContainerPerDiemChargesComputation,
  containerPerDiemChargesComputationExample,
  runContainerPerDiemChargesComputation,
} from "./tool.js";

describe("logistics/container-per-diem-charges-computation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runContainerPerDiemChargesComputation(
        containerPerDiemChargesComputationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: containerPerDiemChargesComputationExample.output,
    });
  });

  it("applies the cap when charges exceed it", () => {
    const result = runContainerPerDiemChargesComputation({
      chargeCapAmount: 500,
      chargeableDays: 10,
      perDiemRate: 90,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.capApplied).toBe(true);
    expect(result.output.totalDue).toBe(500);
    expect(result.output.uncappedTotal).toBe(900);
  });

  it("does not apply a cap that exactly equals the charge", () => {
    expect(
      calculateContainerPerDiemChargesComputation({
        chargeCapAmount: 500,
        chargeableDays: 5,
        perDiemRate: 100,
      }),
    ).toEqual({ capApplied: false, totalDue: 500, uncappedTotal: 500 });
  });

  it("returns zero for no chargeable days", () => {
    expect(
      calculateContainerPerDiemChargesComputation({
        chargeableDays: 0,
        perDiemRate: 185,
      }),
    ).toEqual({ capApplied: false, totalDue: 0, uncappedTotal: 0 });
  });

  it("reports an invalid public rate on its field", () => {
    const result = runContainerPerDiemChargesComputation({
      chargeableDays: 2,
      perDiemRate: -1,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "perDiemRate",
    });
  });

  it("rejects invalid direct inputs and overflowing charges", () => {
    expect(() =>
      calculateContainerPerDiemChargesComputation({
        chargeableDays: 1.5,
        perDiemRate: 100,
      }),
    ).toThrow("safe integer");
    expect(() =>
      calculateContainerPerDiemChargesComputation({
        chargeableDays: 1,
        perDiemRate: Number.NaN,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateContainerPerDiemChargesComputation({
        chargeCapAmount: Number.POSITIVE_INFINITY,
        chargeableDays: 1,
        perDiemRate: 100,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateContainerPerDiemChargesComputation({
        chargeableDays: Number.MAX_SAFE_INTEGER,
        perDiemRate: Number.MAX_VALUE,
      }),
    ).toThrow("too large to represent");
  });
});
