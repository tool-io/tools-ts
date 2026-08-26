import { describe, expect, it } from "vitest";
import {
  calculateYouthBulgeShareChecker,
  runYouthBulgeShareChecker,
  youthBulgeShareCheckerExample,
} from "./tool.js";

describe("demography/youth-bulge-share-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runYouthBulgeShareChecker(youthBulgeShareCheckerExample.input),
    ).toEqual({
      ok: true,
      output: youthBulgeShareCheckerExample.output,
    });
  });

  it("flags a bulge when youths reach the threshold share of adults", () => {
    expect(
      calculateYouthBulgeShareChecker({
        populationAged15to29: 3000,
        populationAged30AndOver: 7000,
      }),
    ).toEqual({
      youthShareOfAdultsPercent: 30,
      youthBulge: true,
    });
  });

  it("rejects empty older-adult counts and out-of-range thresholds", () => {
    expect(
      runYouthBulgeShareChecker({
        populationAged15to29: 10,
        populationAged30AndOver: 0,
      }).ok,
    ).toBe(false);
    expect(
      runYouthBulgeShareChecker({
        populationAged15to29: 10,
        populationAged30AndOver: 90,
        thresholdPercent: 150,
      }).ok,
    ).toBe(false);
  });
});
