import { describe, expect, it } from "vitest";
import { hoekBrownCriterionExample, runHoekBrownCriterion } from "./tool.js";

describe("hoek-brown-criterion", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHoekBrownCriterion(hoekBrownCriterionExample.input)).toEqual({
      ok: true,
      output: hoekBrownCriterionExample.output,
    });
  });

  it("returns sigma_ci at zero confinement for intact rock", () => {
    const result = runHoekBrownCriterion({
      sigmaCiMPa: 30,
      sigma3MPa: 0,
      miConstant: 10,
      gsi: 100,
      disturbanceD: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.sigma1MPa as number).toBe(30);
  });

  it("rejects GSI values outside 0 to 100", () => {
    expect(
      runHoekBrownCriterion({
        sigmaCiMPa: 50,
        sigma3MPa: 5,
        miConstant: 10,
        gsi: 101,
      }).ok,
    ).toBe(false);
  });
});
