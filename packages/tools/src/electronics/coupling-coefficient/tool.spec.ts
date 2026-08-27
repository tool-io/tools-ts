import { describe, expect, it } from "vitest";
import {
  calculateCouplingCoefficient,
  couplingCoefficientExample,
  runCouplingCoefficient,
} from "./tool.js";

describe("Coupling Coefficient", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCouplingCoefficient(couplingCoefficientExample.input)).toEqual({
      ok: true,
      output: couplingCoefficientExample.output,
    });
  });

  it("rejects physically impossible mutual inductance", () => {
    expect(
      runCouplingCoefficient({
        inductanceOneH: 0.01,
        inductanceTwoH: 0.04,
        mutualInductanceH: 0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_coupling" }] },
      ok: false,
    });
  });

  it("returns exactly one for perfect coupling", () => {
    expect(
      calculateCouplingCoefficient({
        inductanceOneH: 0.01,
        inductanceTwoH: 0.01,
        mutualInductanceH: 0.01,
      }).couplingCoefficientK,
    ).toBe(1);
  });
});
