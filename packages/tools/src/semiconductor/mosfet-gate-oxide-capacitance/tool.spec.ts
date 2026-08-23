import { describe, expect, it } from "vitest";
import { calculateMosfetOxideThickness } from "../mosfet-oxide-thickness/tool.js";
import {
  calculateMosfetGateOxideCapacitance,
  mosfetGateOxideCapacitanceExample,
  runMosfetGateOxideCapacitance,
} from "./tool.js";

describe("MOSFET SiO2 gate oxide capacitance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMosfetGateOxideCapacitance(mosfetGateOxideCapacitanceExample.input),
    ).toEqual({ ok: true, output: mosfetGateOxideCapacitanceExample.output });
  });

  it("is the inverse of ideal oxide thickness", () => {
    const capacitance = calculateMosfetGateOxideCapacitance({
      oxideThicknessNm: 2,
    }).coxFfPerUm2;
    expect(
      calculateMosfetOxideThickness({ coxFfPerUm2: capacitance })
        .oxideThicknessNm,
    ).toBeCloseTo(2, 12);
  });

  it("rejects non-positive thickness", () => {
    expect(() =>
      calculateMosfetGateOxideCapacitance({ oxideThicknessNm: -1 }),
    ).toThrow();
  });
});
