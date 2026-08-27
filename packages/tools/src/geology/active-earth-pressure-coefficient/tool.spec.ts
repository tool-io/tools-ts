import { describe, expect, it } from "vitest";
import {
  activeEarthPressureCoefficientExample,
  runActiveEarthPressureCoefficient,
} from "./tool.js";

describe("active-earth-pressure-coefficient", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runActiveEarthPressureCoefficient(
        activeEarthPressureCoefficientExample.input,
      ),
    ).toEqual({
      ok: true,
      output: activeEarthPressureCoefficientExample.output,
    });
  });

  it("gives Ka = 1 for a frictionless soil", () => {
    const result = runActiveEarthPressureCoefficient({ frictionAngleDeg: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.activeCoefficient as number).toBe(1);
  });

  it("rejects friction angles of 90 degrees or more", () => {
    expect(runActiveEarthPressureCoefficient({ frictionAngleDeg: 90 }).ok).toBe(
      false,
    );
  });
});
