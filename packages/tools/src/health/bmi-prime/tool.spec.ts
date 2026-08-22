import { describe, expect, it } from "vitest";
import { bmiPrimeExample, runBmiPrime } from "./tool.js";

describe("BMI Prime Calculator", () => {
  it("matches the canonical example", () => {
    expect(runBmiPrime(bmiPrimeExample.input)).toEqual({
      ok: true,
      output: bmiPrimeExample.output,
    });
  });

  it("returns an exact high precision result", () => {
    expect(runBmiPrime({ heightM: 1.75, weightKg: 63.5 })).toEqual({
      ok: true,
      output: { bmi: 20.73469387755102, bmiPrime: 0.8293877551020408 },
    });
  });

  it("yields a prime of exactly one at the overweight boundary", () => {
    const result = runBmiPrime({ heightM: 1.8, weightKg: 81 });
    expect(result.ok ? result.output.bmi : Number.NaN).toBe(25);
    expect(result.ok ? result.output.bmiPrime : Number.NaN).toBe(1);
  });

  it("stays above one for obese range input", () => {
    const result = runBmiPrime({ heightM: 1.7, weightKg: 100 });
    expect(result.ok ? result.output.bmiPrime : 0).toBeGreaterThan(1);
  });

  it("rejects zero height with a stable code", () => {
    const result = runBmiPrime({ heightM: 0, weightKg: 70 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "positive_finite_number_required",
        field: "heightM",
      });
  });

  it("rejects negative height with the same code", () => {
    const result = runBmiPrime({ heightM: -1.8, weightKg: 70 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe(
        "positive_finite_number_required",
      );
  });

  it("rejects negative weight consistently", () => {
    const result = runBmiPrime({ heightM: 1.8, weightKg: -70 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "positive_finite_number_required",
        field: "weightKg",
      });
  });

  it("rejects non object input", () =>
    expect(runBmiPrime(null).ok).toBe(false));

  it("rejects unknown fields", () => {
    const result = runBmiPrime({ heightM: 1.8, weightKg: 70, extra: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });

  it("rejects missing fields", () => {
    const result = runBmiPrime({ heightM: 1.8 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("weightKg");
  });

  it("keeps bmi prime equal to bmi divided by twenty five", () => {
    const result = runBmiPrime({ heightM: 2, weightKg: 104 });
    expect(
      result.ok ? result.output.bmiPrime === result.output.bmi / 25 : false,
    ).toBe(true);
  });
});
