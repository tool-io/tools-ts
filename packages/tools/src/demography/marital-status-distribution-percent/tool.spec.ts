import { describe, expect, it } from "vitest";
import {
  calculateMaritalStatusDistributionPercent,
  maritalStatusDistributionPercentExample,
  runMaritalStatusDistributionPercent,
} from "./tool.js";

describe("marital-status-distribution-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMaritalStatusDistributionPercent(
        maritalStatusDistributionPercentExample.input,
      ),
    ).toEqual({
      ok: true,
      output: maritalStatusDistributionPercentExample.output,
    });
  });

  it("sums to one hundred percent", () => {
    const r = calculateMaritalStatusDistributionPercent({
      single: 1,
      married: 2,
      widowed: 3,
      divorced: 4,
    });
    expect(
      r.singlePercent + r.marriedPercent + r.widowedPercent + r.divorcedPercent,
    ).toBeCloseTo(100);
  });

  it("rejects negative counts", () => {
    expect(
      runMaritalStatusDistributionPercent({
        single: -1,
        married: 2,
        widowed: 3,
        divorced: 4,
      }).ok,
    ).toBe(false);
  });
});
