import { describe, expect, it } from "vitest";
import {
  calculateLexisDiagramCellClassifier,
  runLexisDiagramCellClassifier,
  lexisDiagramCellClassifierExample,
} from "./tool.js";

describe("demography/lexis-diagram-cell-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLexisDiagramCellClassifier(lexisDiagramCellClassifierExample.input),
    ).toEqual({ ok: true, output: lexisDiagramCellClassifierExample.output });
  });

  it("classifies period-cohort and cohort-age cells", () => {
    const pc = calculateLexisDiagramCellClassifier({
      periodInterval: [2020, 2025],
      cohortInterval: [1995, 2000],
    });
    expect(pc.lexisClassCode).toBe("PC");
    expect(pc.freeDimension).toBe("age");
    expect(pc.impliedFreeInterval).toEqual([20, 30]);
    const lc = calculateLexisDiagramCellClassifier({
      ageInterval: [30, 35],
      cohortInterval: [1990, 1995],
    });
    expect(lc.lexisClassCode).toBe("LC");
    expect(lc.impliedFreeInterval).toEqual([2020, 2030]);
  });

  it("detects a degenerate point cell and rejects wrong bound counts", () => {
    const diagonal = calculateLexisDiagramCellClassifier({
      ageInterval: [40, 40],
      periodInterval: [2040, 2040],
    });
    expect(diagonal.isDiagonalLine).toBe(true);
    expect(diagonal.impliedFreeInterval).toEqual([2000, 2000]);
    expect(runLexisDiagramCellClassifier({ ageInterval: [0, 5] }).ok).toBe(
      false,
    );
    expect(
      runLexisDiagramCellClassifier({
        ageInterval: [5, 0],
        periodInterval: [2000, 2005],
      }).ok,
    ).toBe(false);
  });
});
