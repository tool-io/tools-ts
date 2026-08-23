import { describe, expect, it } from "vitest";
import {
  sampleSizeMeanExample,
  calculateSampleSizeMean,
  runSampleSizeMean,
} from "./tool.js";

describe("statistics/sample-size-mean", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSampleSizeMean(sampleSizeMeanExample.input)).toEqual({
      ok: true,
      output: sampleSizeMeanExample.output,
    });
  });
  it("rejects invalid input (invalid_sigma)", () => {
    expect(
      runSampleSizeMean({ populationStdDev: 0, marginOfError: 5 }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (invalid_margin)", () => {
    expect(
      runSampleSizeMean({ populationStdDev: 15, marginOfError: -1 }).ok,
    ).toBe(false);
  });
});
