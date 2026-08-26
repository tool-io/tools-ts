import { describe, expect, it } from "vitest";
import {
  calculateInterpunctDensityCalculator,
  interpunctDensityCalculatorExample,
  runInterpunctDensityCalculator,
} from "./tool.js";

describe("epigraphy/interpunct-density-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runInterpunctDensityCalculator(interpunctDensityCalculatorExample.input),
    ).toEqual({ ok: true, output: interpunctDensityCalculatorExample.output });
  });

  it("averages across blank and heavily punctuated lines", () => {
    expect(
      calculateInterpunctDensityCalculator({
        lines: ["S\u00b7P\u00b7Q\u00b7R", "", "X\u00b7"],
      }),
    ).toEqual({
      interpunctCount: 4,
      lineCount: 3,
      averagePerLine: 1.3333333333333333,
    });
  });

  it("rejects an empty line list", () => {
    expect(runInterpunctDensityCalculator({ lines: [] }).ok).toBe(false);
  });
});
