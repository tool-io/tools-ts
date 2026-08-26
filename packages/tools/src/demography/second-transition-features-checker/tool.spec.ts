import { describe, expect, it } from "vitest";
import {
  calculateSecondTransitionFeaturesChecker,
  runSecondTransitionFeaturesChecker,
  secondTransitionFeaturesCheckerExample,
} from "./tool.js";

describe("demography/second-transition-features-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSecondTransitionFeaturesChecker(
        secondTransitionFeaturesCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: secondTransitionFeaturesCheckerExample.output,
    });
  });

  it("labels all four markers as a full profile", () => {
    expect(
      calculateSecondTransitionFeaturesChecker({
        fertilityBelowReplacement: true,
        parenthoodPostponement: true,
        unionInstabilityRise: true,
        householdDiversification: true,
      }),
    ).toEqual({ matchedMarkers: 4, sdtProfile: "full-sdt" });
  });

  it("defaults to no markers when nothing is supplied", () => {
    expect(runSecondTransitionFeaturesChecker({})).toEqual({
      ok: true,
      output: { matchedMarkers: 0, sdtProfile: "no-sdt-marker" },
    });
  });
});
