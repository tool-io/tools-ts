import { describe, expect, it } from "vitest";
import {
  calculateAdultMortality45Q15,
  runAdultMortality45Q15,
  adultMortality45Q15Example,
} from "./tool.js";

describe("demography/adult-mortality-45q15", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAdultMortality45Q15(adultMortality45Q15Example.input)).toEqual({
      ok: true,
      output: adultMortality45Q15Example.output,
    });
  });

  it("converts a single constant rate exactly", () => {
    const q = (5 * 0.01) / (1 + (5 - 2.5) * 0.01);
    expect(calculateAdultMortality45Q15({ nmx: [0.01, 0.01, 0.01] })).toEqual({
      adultMortality45q15: 1 - (1 - q) ** 3,
    });
  });

  it("rejects empty schedules or out-of-range separation factors", () => {
    expect(runAdultMortality45Q15({ nmx: [] }).ok).toBe(false);
    expect(runAdultMortality45Q15({ nmx: [0.01], aX: 6 }).ok).toBe(false);
    expect(runAdultMortality45Q15({ nmx: [0] }).ok).toBe(false);
  });
});
