import { describe, expect, it } from "vitest";
import {
  calculateMortalityGraduationReadChartSmoothing,
  runMortalityGraduationReadChartSmoothing,
  mortalityGraduationReadChartSmoothingExample,
} from "./tool.js";

describe("demography/mortality-graduation-read-chart-smoothing", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMortalityGraduationReadChartSmoothing(
        mortalityGraduationReadChartSmoothingExample.input,
      ),
    ).toEqual({
      ok: true,
      output: mortalityGraduationReadChartSmoothingExample.output,
    });
  });

  it("flattens a constant schedule regardless of passes", () => {
    expect(
      calculateMortalityGraduationReadChartSmoothing({
        centralDeathRates: [0.05, 0.05, 0.05],
        passes: 4,
      }).graduatedRates,
    ).toEqual([0.05, 0.05, 0.05]);
  });

  it("rejects short or negative schedules", () => {
    expect(
      runMortalityGraduationReadChartSmoothing({
        centralDeathRates: [0.01, 0.02],
      }).ok,
    ).toBe(false);
    expect(
      runMortalityGraduationReadChartSmoothing({
        centralDeathRates: [0.01, -0.02, 0.03],
      }).ok,
    ).toBe(false);
  });
});
