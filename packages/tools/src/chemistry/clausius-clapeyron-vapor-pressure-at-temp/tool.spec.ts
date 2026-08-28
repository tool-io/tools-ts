import { describe, expect, it } from "vitest";
import {
  clausiusVaporPressureAtTempExample,
  runClausiusVaporPressureAtTemp,
} from "./tool.js";

describe("Clausius Vapor Pressure At T", () => {
  it("computes the canonical example", () =>
    expect(
      runClausiusVaporPressureAtTemp(clausiusVaporPressureAtTempExample.input),
    ).toEqual({
      ok: true,
      output: clausiusVaporPressureAtTempExample.output,
    }));

  it("returns the reference pressure at the reference temperature", () => {
    const result = runClausiusVaporPressureAtTemp({
      deltaHvapJPerMol: 40650,
      p1Hpa: 100,
      t1K: 373.15,
      t2K: 373.15,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.vaporPressureHpa2).toBeCloseTo(100, 12);
  });

  it("lowers pressure when cooling", () => {
    const result = runClausiusVaporPressureAtTemp({
      deltaHvapJPerMol: 40650,
      p1Hpa: 100,
      t1K: 373.15,
      t2K: 298.15,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.vaporPressureHpa2).toBeLessThan(100);
  });

  it("raises pressure when heating", () => {
    const result = runClausiusVaporPressureAtTemp({
      deltaHvapJPerMol: 40650,
      p1Hpa: 100,
      t1K: 373.15,
      t2K: 423.15,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.vaporPressureHpa2).toBeGreaterThan(100);
  });

  it("rejects non positive enthalpy", () =>
    expect(
      runClausiusVaporPressureAtTemp({
        deltaHvapJPerMol: 0,
        p1Hpa: 100,
        t1K: 373.15,
        t2K: 298.15,
      }).ok,
    ).toBe(false));

  it("is continuous at equal temperatures", () => {
    const result = runClausiusVaporPressureAtTemp({
      deltaHvapJPerMol: 40650,
      p1Hpa: 100,
      t1K: 300,
      t2K: 300,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.vaporPressureHpa2).toBeCloseTo(100, 12);
  });
});
