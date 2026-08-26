import { describe, expect, it } from "vitest";
import {
  calculateAxAverageYearsDyingRule,
  runAxAverageYearsDyingRule,
  axAverageYearsDyingRuleExample,
} from "./tool.js";

describe("demography/ax-average-years-dying-rule", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAxAverageYearsDyingRule(axAverageYearsDyingRuleExample.input),
    ).toEqual({
      ok: true,
      output: axAverageYearsDyingRuleExample.output,
    });
  });

  it("applies the Coale-Demeny infant rule and the five-year midpoint", () => {
    expect(
      calculateAxAverageYearsDyingRule({
        n: 1,
        mx: 0.02,
        method: "coaleDemenyInfant",
      }),
    ).toEqual({
      averageYearsDying: 0.10400000000000001,
      probabilityOfDying: (1 * 0.02) / (1 + (1 - 0.10400000000000001) * 0.02),
    });
    expect(
      calculateAxAverageYearsDyingRule({ n: 5, mx: 0.01 }).averageYearsDying,
    ).toBe(2.5);
  });

  it("rejects a non-positive width or rate", () => {
    expect(runAxAverageYearsDyingRule({ n: 0, mx: 0.02 }).ok).toBe(false);
    expect(runAxAverageYearsDyingRule({ n: 5, mx: 0 }).ok).toBe(false);
  });
});
