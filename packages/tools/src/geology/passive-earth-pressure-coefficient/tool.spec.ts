import { describe, expect, it } from "vitest";
import {
  passiveEarthPressureCoefficientExample,
  runPassiveEarthPressureCoefficient,
} from "./tool.js";

describe("passive-earth-pressure-coefficient", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPassiveEarthPressureCoefficient(
        passiveEarthPressureCoefficientExample.input,
      ),
    ).toEqual({
      ok: true,
      output: passiveEarthPressureCoefficientExample.output,
    });
  });

  it("gives Kp = 1 for a frictionless soil", () => {
    const result = runPassiveEarthPressureCoefficient({ frictionAngleDeg: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.passiveCoefficient as number).toBe(1);
  });

  it("rejects negative friction angles", () => {
    expect(
      runPassiveEarthPressureCoefficient({ frictionAngleDeg: -5 }).ok,
    ).toBe(false);
  });
});
