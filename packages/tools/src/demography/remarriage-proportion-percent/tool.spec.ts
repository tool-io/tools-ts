import { describe, expect, it } from "vitest";
import {
  remarriageProportionPercentExample,
  runRemarriageProportionPercent,
} from "./tool.js";

describe("remarriage-proportion-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRemarriageProportionPercent(remarriageProportionPercentExample.input),
    ).toEqual({
      ok: true,
      output: remarriageProportionPercentExample.output,
    });
  });

  it("treats every marriage as a first marriage when no remarriages occur", () => {
    const r = runRemarriageProportionPercent({
      totalMarriages: 250,
      remarriageCount: 0,
    });
    expect(r.ok && r.output.firstMarriageProportionPercent).toBe(100);
  });

  it("rejects remarriages above the marriage total", () => {
    expect(
      runRemarriageProportionPercent({
        totalMarriages: 10,
        remarriageCount: 11,
      }).ok,
    ).toBe(false);
  });
});
