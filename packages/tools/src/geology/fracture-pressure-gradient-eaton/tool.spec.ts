import { describe, expect, it } from "vitest";
import {
  fracturePressureGradientEatonExample,
  runFracturePressureGradientEaton,
} from "./tool.js";

describe("fracture-pressure-gradient-eaton", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFracturePressureGradientEaton(
        fracturePressureGradientEatonExample.input,
      ),
    ).toEqual({
      ok: true,
      output: fracturePressureGradientEatonExample.output,
    });
  });

  it("approaches the pore pressure gradient as Poisson ratio vanishes", () => {
    const result = runFracturePressureGradientEaton({
      overburdenStressGradientPaPerMetre: 22620,
      poissonRatio: 0.001,
      porePressureGradientPaPerMetre: 9810,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.fracturePressureGradientPaPerMetre).toBeCloseTo(
      9822.8228,
      3,
    );
  });

  it("rejects Poisson ratios outside the physical range", () => {
    expect(
      runFracturePressureGradientEaton({
        overburdenStressGradientPaPerMetre: 22620,
        poissonRatio: 1,
        porePressureGradientPaPerMetre: 9810,
      }).ok,
    ).toBe(false);
  });
});
