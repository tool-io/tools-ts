import { describe, expect, it } from "vitest";
import {
  calculateElasticThickness,
  elasticThicknessExample,
  runElasticThickness,
} from "./tool.js";

describe("geology/elastic-thickness", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runElasticThickness(elasticThicknessExample.input)).toEqual({
      ok: true,
      output: elasticThicknessExample.output,
    });
  });

  it("scales with the cube of elastic thickness", () => {
    const thin = calculateElasticThickness({
      thicknessM: 10000,
      youngsModulusPa: 70e9,
      poissonsRatio: 0.25,
    });
    const thick = calculateElasticThickness({
      thicknessM: 20000,
      youngsModulusPa: 70e9,
      poissonsRatio: 0.25,
    });
    expect(
      thick.flexuralRigidityNewtonMeter / thin.flexuralRigidityNewtonMeter,
    ).toBe(8);
  });

  it("rejects non-positive modulus and out-of-range Poisson ratio", () => {
    expect(
      runElasticThickness({
        thicknessM: 30000,
        youngsModulusPa: 0,
        poissonsRatio: 0.25,
      }).ok,
    ).toBe(false);
    expect(
      runElasticThickness({
        thicknessM: 30000,
        youngsModulusPa: 70e9,
        poissonsRatio: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runElasticThickness({
        thicknessM: 0,
        youngsModulusPa: 70e9,
        poissonsRatio: 0.25,
      }).ok,
    ).toBe(false);
  });
});
