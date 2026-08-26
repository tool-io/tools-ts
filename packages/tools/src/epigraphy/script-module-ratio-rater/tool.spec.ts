import { describe, expect, it } from "vitest";
import {
  calculateScriptModuleRatioRater,
  runScriptModuleRatioRater,
  scriptModuleRatioRaterExample,
} from "./tool.js";

describe("epigraphy/script-module-ratio-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runScriptModuleRatioRater(scriptModuleRatioRaterExample.input),
    ).toEqual({ ok: true, output: scriptModuleRatioRaterExample.output });
  });

  it("accepts modules matching and exceeding the reference proportion", () => {
    expect(
      calculateScriptModuleRatioRater({
        letterWidthMm: 7.5,
        letterHeightMm: 10,
      }).verdict,
    ).toBe("reference");
    expect(
      calculateScriptModuleRatioRater({ letterWidthMm: 9, letterHeightMm: 10 }),
    ).toEqual({ widthToHeightRatio: 0.9, verdict: "expanded" });
  });

  it("honors custom reference ratios and tolerances", () => {
    const result = calculateScriptModuleRatioRater({
      letterWidthMm: 5,
      letterHeightMm: 10,
      referenceRatio: 0.5,
      toleranceRatio: 0.01,
    });
    expect(result.widthToHeightRatio).toBe(0.5);
    expect(result.verdict).toBe("reference");
  });

  it("rejects zero dimensions and invalid tolerances", () => {
    expect(
      runScriptModuleRatioRater({ letterWidthMm: 0, letterHeightMm: 10 }).ok,
    ).toBe(false);
    expect(
      runScriptModuleRatioRater({
        letterWidthMm: 6,
        letterHeightMm: 10,
        toleranceRatio: -1,
      }).ok,
    ).toBe(false);
  });
});
