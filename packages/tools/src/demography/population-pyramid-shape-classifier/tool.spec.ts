import { describe, expect, it } from "vitest";
import {
  calculatePopulationPyramidShapeClassifier,
  runPopulationPyramidShapeClassifier,
  populationPyramidShapeClassifierExample,
} from "./tool.js";

describe("demography/population-pyramid-shape-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPopulationPyramidShapeClassifier(
        populationPyramidShapeClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: populationPyramidShapeClassifierExample.output,
    });
  });

  it("classifies constrictive and stationary shapes", () => {
    expect(
      calculatePopulationPyramidShapeClassifier({
        percentYoung: 13,
        percentWorking: 60,
        percentOld: 27,
      }).shapeClass,
    ).toBe("constrictive");
    expect(
      calculatePopulationPyramidShapeClassifier({
        percentYoung: 20,
        percentWorking: 60,
        percentOld: 20,
      }).shapeClass,
    ).toBe("stationary");
  });

  it("rejects shares that do not sum to one hundred", () => {
    expect(
      runPopulationPyramidShapeClassifier({
        percentYoung: 50,
        percentWorking: 60,
        percentOld: 10,
      }).ok,
    ).toBe(false);
  });
});
