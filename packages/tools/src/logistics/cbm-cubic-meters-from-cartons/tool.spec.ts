import { describe, expect, it } from "vitest";
import {
  calculateCbmCubicMetersFromCartons,
  cbmCubicMetersFromCartonsExample,
  runCbmCubicMetersFromCartons,
} from "./tool.js";

describe("cbm-cubic-meters-from-cartons", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCbmCubicMetersFromCartons(cbmCubicMetersFromCartonsExample.input),
    ).toEqual({
      ok: true,
      output: cbmCubicMetersFromCartonsExample.output,
    });
  });

  it("converts a one-metre cube and defaults to one carton", () => {
    const result = runCbmCubicMetersFromCartons({
      cartonLengthCm: 100,
      cartonWidthCm: 100,
      cartonHeightCm: 100,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.volumePerCartonCbm).toBe(1);
    expect(result.output.totalVolumeCbm).toBe(1);
  });

  it("preserves a finite result when the naive intermediate overflows", () => {
    const result = calculateCbmCubicMetersFromCartons({
      cartonLengthCm: 1e200,
      cartonWidthCm: 1e200,
      cartonHeightCm: 1e-200,
    });
    expect(result.volumePerCartonCbm / 1e194).toBeCloseTo(1, 12);
    expect(result.totalVolumeCbm / 1e194).toBeCloseTo(1, 12);
  });

  it("reports invalid public dimensions precisely", () => {
    const result = runCbmCubicMetersFromCartons({
      cartonLengthCm: 0,
      cartonWidthCm: 40,
      cartonHeightCm: 40,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues).toEqual([
      expect.objectContaining({
        code: "invalid_field",
        field: "cartonLengthCm",
      }),
    ]);
  });

  it("rejects invalid counts and unrepresentable volumes", () => {
    expect(() =>
      calculateCbmCubicMetersFromCartons({
        cartonLengthCm: 60,
        cartonWidthCm: 40,
        cartonHeightCm: 40,
        cartonCount: 1.5,
      }),
    ).toThrow("safe integer");
    expect(() =>
      calculateCbmCubicMetersFromCartons({
        cartonLengthCm: Number.MIN_VALUE,
        cartonWidthCm: Number.MIN_VALUE,
        cartonHeightCm: Number.MIN_VALUE,
      }),
    ).toThrow("outside the representable range");
    expect(() =>
      calculateCbmCubicMetersFromCartons({
        cartonLengthCm: Number.POSITIVE_INFINITY,
        cartonWidthCm: 40,
        cartonHeightCm: 40,
      }),
    ).toThrow("must be finite");
  });
});
