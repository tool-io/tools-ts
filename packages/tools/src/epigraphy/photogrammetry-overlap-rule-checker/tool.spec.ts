import { describe, expect, it } from "vitest";
import {
  photogrammetryOverlapRuleCheckerExample,
  runPhotogrammetryOverlapRuleChecker,
} from "./tool.js";

describe("photogrammetry-overlap-rule-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPhotogrammetryOverlapRuleChecker(
        photogrammetryOverlapRuleCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: photogrammetryOverlapRuleCheckerExample.output,
    });
  });

  it("reports deficits below the default thresholds", () => {
    expect(
      runPhotogrammetryOverlapRuleChecker({
        forwardOverlapPercent: 55,
        sideOverlapPercent: 25,
      }),
    ).toEqual({
      ok: true,
      output: {
        meetsRule: false,
        forwardDeficitPercent: 5,
        sideDeficitPercent: 0,
      },
    });
  });
  it("rejects out-of-range overlaps", () => {
    expect(
      runPhotogrammetryOverlapRuleChecker({
        forwardOverlapPercent: 150,
        sideOverlapPercent: 30,
      }).ok,
    ).toBe(false);
  });
});
