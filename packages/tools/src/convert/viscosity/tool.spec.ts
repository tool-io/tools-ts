import { describe, expect, it } from "vitest";
import { runViscosity, viscosityExample } from "./tool.js";

describe("viscosity converter", () => {
  it("reproduces its dynamic-viscosity example", () => {
    expect(runViscosity(viscosityExample.input)).toEqual({
      ok: true,
      output: viscosityExample.output,
    });
  });

  it("uses the exact centistokes conversion", () => {
    expect(
      runViscosity({
        fromUnit: "cSt",
        quantity: "kinematic",
        toUnit: "m2/s",
        value: 1,
      }),
    ).toEqual({
      ok: true,
      output: { quantity: "kinematic", unit: "m2/s", value: 1e-6 },
    });
  });

  it("rejects conversion between dynamic and kinematic units", () => {
    const result = runViscosity({
      fromUnit: "cP",
      quantity: "dynamic",
      toUnit: "cSt",
      value: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "viscosity_quantity_mismatch",
        field: "toUnit",
      });
  });
});
