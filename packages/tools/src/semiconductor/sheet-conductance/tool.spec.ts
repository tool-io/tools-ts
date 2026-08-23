import { describe, expect, it } from "vitest";
import {
  calculateSheetConductance,
  runSheetConductance,
  sheetConductanceExample,
} from "./tool.js";

describe("sheet conductance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSheetConductance(sheetConductanceExample.input)).toEqual({
      ok: true,
      output: sheetConductanceExample.output,
    });
  });

  it("doubles when thickness doubles", () => {
    const oneMicrometer = calculateSheetConductance({
      donorDopingPerCm3: 1e16,
      filmThicknessUm: 1,
    }).sheetConductanceSPerSq;
    const twoMicrometers = calculateSheetConductance({
      donorDopingPerCm3: 1e16,
      filmThicknessUm: 2,
    }).sheetConductanceSPerSq;
    expect(twoMicrometers).toBeCloseTo(oneMicrometer * 2, 12);
  });

  it("rejects values whose positive result underflows", () => {
    expect(() =>
      calculateSheetConductance({
        donorDopingPerCm3: Number.MIN_VALUE,
        filmThicknessUm: 1,
      }),
    ).toThrow();
  });
});
