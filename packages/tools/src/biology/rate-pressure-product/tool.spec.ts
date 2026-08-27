import { describe, expect, it } from "vitest";
import { ratePressureProductExample, runRatePressureProduct } from "./tool.js";

describe("RPP", () => {
  it("publishes an executable example", () =>
    expect(runRatePressureProduct(ratePressureProductExample.input)).toEqual({
      ok: true,
      output: ratePressureProductExample.output,
    }));
  it("scales heart rate and systolic pressure by one thousandth", () =>
    expect(
      runRatePressureProduct({ heartRateBpm: 60, systolicMmHg: 100 }),
    ).toEqual({ ok: true, output: { ratePressureProduct: 6 } }));
  it("computes another valid result", () =>
    expect(
      runRatePressureProduct({ heartRateBpm: 120, systolicMmHg: 180 }),
    ).toEqual({ ok: true, output: { ratePressureProduct: 21.6 } }));
  it("rejects zero heart rate", () => {
    const result = runRatePressureProduct({
      heartRateBpm: 0,
      systolicMmHg: 120,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects zero systolic pressure", () => {
    const result = runRatePressureProduct({
      heartRateBpm: 70,
      systolicMmHg: 0,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative systolic pressure", () => {
    const result = runRatePressureProduct({
      heartRateBpm: 70,
      systolicMmHg: -120,
    });
    expect(result.ok).toBe(false);
  });
});
