import { describe, expect, it } from "vitest";
import {
  bloodPressureCategoryExample,
  runBloodPressureCategory,
} from "./tool.js";

describe("BP Category Lookup", () => {
  it("publishes an executable example", () =>
    expect(
      runBloodPressureCategory(bloodPressureCategoryExample.input),
    ).toEqual({ ok: true, output: bloodPressureCategoryExample.output }));
  it("classifies elevated pressures", () =>
    expect(
      runBloodPressureCategory({ diastolicMmHg: 78, systolicMmHg: 125 }),
    ).toEqual({ ok: true, output: { category: "elevated" } }));
  it("classifies stage-1 when systolic is below 140", () =>
    expect(
      runBloodPressureCategory({ diastolicMmHg: 85, systolicMmHg: 132 }),
    ).toEqual({ ok: true, output: { category: "stage-1" } }));
  it("uses the higher category when systolic reaches stage two", () =>
    expect(
      runBloodPressureCategory({ diastolicMmHg: 88, systolicMmHg: 145 }),
    ).toEqual({ ok: true, output: { category: "stage-2" } }));

  it("uses the higher category when diastolic reaches stage two", () =>
    expect(
      runBloodPressureCategory({ diastolicMmHg: 92, systolicMmHg: 135 }),
    ).toEqual({ ok: true, output: { category: "stage-2" } }));
  it("classifies stage-2 for high readings", () =>
    expect(
      runBloodPressureCategory({ diastolicMmHg: 95, systolicMmHg: 150 }),
    ).toEqual({ ok: true, output: { category: "stage-2" } }));
  it("accepts the extreme valid reading", () =>
    expect(
      runBloodPressureCategory({ diastolicMmHg: 200, systolicMmHg: 300 }),
    ).toEqual({ ok: true, output: { category: "stage-2" } }));
  it("rejects equal pressures", () => {
    const result = runBloodPressureCategory({
      diastolicMmHg: 120,
      systolicMmHg: 120,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_pressure");
  });
  it("rejects inverted pressures", () => {
    const result = runBloodPressureCategory({
      diastolicMmHg: 110,
      systolicMmHg: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_pressure");
  });
  it("rejects out-of-range pressures", () => {
    expect(
      runBloodPressureCategory({ diastolicMmHg: 76, systolicMmHg: 69 }).ok,
    ).toBe(false);
    expect(
      runBloodPressureCategory({ diastolicMmHg: 39, systolicMmHg: 118 }).ok,
    ).toBe(false);
  });
  it("rejects missing inputs", () =>
    expect(runBloodPressureCategory({ systolicMmHg: 118 }).ok).toBe(false));
});
