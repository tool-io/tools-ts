import { describe, expect, it } from "vitest";
import {
  calculateVacatDotSeriesCounter,
  vacatDotSeriesCounterExample,
  runVacatDotSeriesCounter,
} from "./tool.js";

describe("epigraphy/vacat-dot-series-counter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runVacatDotSeriesCounter(vacatDotSeriesCounterExample.input),
    ).toEqual({ ok: true, output: vacatDotSeriesCounterExample.output });
  });

  it("applies the configurable minimum", () => {
    expect(
      calculateVacatDotSeriesCounter({
        text: "A .. B . C .... D",
        minimumDots: 2,
      }).seriesCount,
    ).toBe(2);
    expect(
      calculateVacatDotSeriesCounter({
        text: "A .. B . C .... D",
        minimumDots: 2,
      }).longestSeries,
    ).toBe(4);
  });

  it("mixes period and middle-dot runs", () => {
    expect(
      calculateVacatDotSeriesCounter({ text: "x.\u00B7.y" }).totalDots,
    ).toBe(3);
  });

  it("rejects non-positive minimums", () => {
    expect(runVacatDotSeriesCounter({ text: "...", minimumDots: 0 }).ok).toBe(
      false,
    );
  });
});
