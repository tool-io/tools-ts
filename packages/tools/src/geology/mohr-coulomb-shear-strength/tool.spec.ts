import { describe, expect, it } from "vitest";
import {
  mohrCoulombShearStrengthExample,
  runMohrCoulombShearStrength,
} from "./tool.js";

describe("mohr-coulomb-shear-strength", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMohrCoulombShearStrength(mohrCoulombShearStrengthExample.input),
    ).toEqual({
      ok: true,
      output: mohrCoulombShearStrengthExample.output,
    });
  });

  it("gives pure cohesion for a zero friction angle at zero stress", () => {
    const result = runMohrCoulombShearStrength({
      normalStressKPa: 0,
      cohesionKPa: 25,
      frictionAngleDeg: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.shearStrengthKPa as number).toBe(25);
  });

  it("rejects negative normal stress", () => {
    expect(
      runMohrCoulombShearStrength({ normalStressKPa: -10, cohesionKPa: 1 }).ok,
    ).toBe(false);
  });
});
