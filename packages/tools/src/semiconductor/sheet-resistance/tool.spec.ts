import { describe, expect, it } from "vitest";
import {
  calculateSheetResistance,
  runSheetResistance,
  sheetResistanceExample,
} from "./tool.js";

describe("sheet resistance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSheetResistance(sheetResistanceExample.input)).toEqual({
      ok: true,
      output: sheetResistanceExample.output,
    });
  });

  it("halves when thickness doubles", () => {
    const oneMicrometer = calculateSheetResistance({
      donorDopingPerCm3: 1e16,
      filmThicknessUm: 1,
    }).sheetResistanceOhmPerSq;
    const twoMicrometers = calculateSheetResistance({
      donorDopingPerCm3: 1e16,
      filmThicknessUm: 2,
    }).sheetResistanceOhmPerSq;
    expect(twoMicrometers).toBeCloseTo(oneMicrometer / 2, 12);
  });

  it("rejects non-positive inputs", () => {
    expect(() =>
      calculateSheetResistance({
        donorDopingPerCm3: -1,
        filmThicknessUm: 1,
      }),
    ).toThrow();
    expect(
      runSheetResistance({ donorDopingPerCm3: 1e16, filmThicknessUm: 0 }).ok,
    ).toBe(false);
  });
});
