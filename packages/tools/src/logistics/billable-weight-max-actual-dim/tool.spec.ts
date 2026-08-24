import { describe, expect, it } from "vitest";
import {
  billableWeightMaxActualDimExample,
  calculateBillableWeightMaxActualDim,
  runBillableWeightMaxActualDim,
} from "./tool.js";

describe("billable-weight-max-actual-dim", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBillableWeightMaxActualDim(billableWeightMaxActualDimExample.input),
    ).toEqual({
      ok: true,
      output: billableWeightMaxActualDimExample.output,
    });
  });

  it("uses actual weight when it is heavier", () => {
    expect(
      calculateBillableWeightMaxActualDim({
        actualWeightKg: 40,
        lengthCm: 30,
        widthCm: 20,
        heightCm: 10,
      }),
    ).toEqual({
      billingBasis: "actual",
      chargeableWeightKg: 40,
      volumetricWeightKg: 1.2,
    });
  });

  it("uses actual weight on an exact tie", () => {
    expect(
      calculateBillableWeightMaxActualDim({
        actualWeightKg: 2,
        lengthCm: 20,
        widthCm: 20,
        heightCm: 25,
      }),
    ).toEqual({
      billingBasis: "actual",
      chargeableWeightKg: 2,
      volumetricWeightKg: 2,
    });
  });

  it("recovers finite results from overflowing and underflowing products", () => {
    const overflowIntermediate = calculateBillableWeightMaxActualDim({
      actualWeightKg: 1,
      lengthCm: 1e200,
      widthCm: 1e200,
      heightCm: 1e-200,
      volumetricDivisorCm3PerKg: 1,
    });
    expect(overflowIntermediate.volumetricWeightKg / 1e200).toBeCloseTo(1, 12);

    const underflowIntermediate = calculateBillableWeightMaxActualDim({
      actualWeightKg: 0.5,
      lengthCm: 1e-200,
      widthCm: 1e-200,
      heightCm: 1e200,
      volumetricDivisorCm3PerKg: 1e-200,
    });
    expect(underflowIntermediate.billingBasis).toBe("volumetric");
    expect(underflowIntermediate.volumetricWeightKg).toBeCloseTo(1, 12);
    expect(underflowIntermediate.chargeableWeightKg).toBeCloseTo(1, 12);
  });

  it("reports a non-positive public measurement on its field", () => {
    const result = runBillableWeightMaxActualDim({
      actualWeightKg: 0,
      lengthCm: 60,
      widthCm: 40,
      heightCm: 40,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues).toEqual([
      expect.objectContaining({
        code: "invalid_field",
        field: "actualWeightKg",
      }),
    ]);
  });

  it("rejects non-finite direct inputs and unrepresentable results", () => {
    expect(() =>
      calculateBillableWeightMaxActualDim({
        actualWeightKg: 10,
        lengthCm: Number.NaN,
        widthCm: 40,
        heightCm: 40,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateBillableWeightMaxActualDim({
        actualWeightKg: 10,
        lengthCm: 60,
        widthCm: 40,
        heightCm: 40,
        volumetricDivisorCm3PerKg: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateBillableWeightMaxActualDim({
        actualWeightKg: 10,
        lengthCm: Number.MAX_VALUE,
        widthCm: Number.MAX_VALUE,
        heightCm: Number.MAX_VALUE,
        volumetricDivisorCm3PerKg: Number.MIN_VALUE,
      }),
    ).toThrow("outside the representable range");
  });
});
