import { describe, expect, it } from "vitest";
import { calculateMosfetGateOxideCapacitance } from "../mosfet-gate-oxide-capacitance/tool.js";
import {
  calculateMosfetOxideThickness,
  mosfetOxideThicknessExample,
  runMosfetOxideThickness,
} from "./tool.js";

describe("MOSFET SiO2 oxide thickness calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const result = runMosfetOxideThickness(mosfetOxideThicknessExample.input);
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        (result.output as { oxideThicknessNm: number }).oxideThicknessNm,
      ).toBeCloseTo(mosfetOxideThicknessExample.output.oxideThicknessNm, 12);
  });

  it("is the inverse of ideal oxide capacitance", () => {
    const thickness = calculateMosfetOxideThickness({
      coxFfPerUm2: 17.26,
    }).oxideThicknessNm;
    expect(
      calculateMosfetGateOxideCapacitance({ oxideThicknessNm: thickness })
        .coxFfPerUm2,
    ).toBeCloseTo(17.26, 12);
  });

  it("rejects zero capacitance", () => {
    expect(() => calculateMosfetOxideThickness({ coxFfPerUm2: 0 })).toThrow();
  });
});
