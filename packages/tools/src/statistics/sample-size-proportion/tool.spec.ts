import { describe, expect, it } from "vitest";
import {
  sampleSizeProportionExample,
  calculateSampleSizeProportion,
  runSampleSizeProportion,
} from "./tool.js";

describe("statistics/sample-size-proportion", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSampleSizeProportion(sampleSizeProportionExample.input)).toEqual({
      ok: true,
      output: sampleSizeProportionExample.output,
    });
  });
  it("rejects invalid input (invalid_proportion)", () => {
    expect(
      runSampleSizeProportion({ proportion: 1, marginOfError: 0.05 }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (invalid_margin)", () => {
    expect(
      runSampleSizeProportion({ proportion: 0.5, marginOfError: 0 }).ok,
    ).toBe(false);
  });
});
