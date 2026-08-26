import { describe, expect, it } from "vitest";
import {
  calculateBirthIntervalMedianByParity,
  runBirthIntervalMedianByParity,
  birthIntervalMedianByParityExample,
} from "./tool.js";

describe("demography/birth-interval-median-by-parity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBirthIntervalMedianByParity(birthIntervalMedianByParityExample.input),
    ).toEqual({
      ok: true,
      output: birthIntervalMedianByParityExample.output,
    });
  });

  it("averages the two central intervals for an even count", () => {
    expect(
      calculateBirthIntervalMedianByParity({ intervals: [10, 40, 20, 30] }),
    ).toEqual({ medianInterval: 25, sampleCount: 4 });
  });

  it("rejects empty or negative intervals", () => {
    expect(runBirthIntervalMedianByParity({ intervals: [] }).ok).toBe(false);
    expect(runBirthIntervalMedianByParity({ intervals: [-3, 12] }).ok).toBe(
      false,
    );
  });
});
