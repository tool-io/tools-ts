import { describe, expect, it } from "vitest";
import {
  calculateOmranEpidemiologicTransitionClassifier,
  runOmranEpidemiologicTransitionClassifier,
  omranEpidemiologicTransitionClassifierExample,
} from "./tool.js";

describe("demography/omran-epidemiologic-transition-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOmranEpidemiologicTransitionClassifier(
        omranEpidemiologicTransitionClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: omranEpidemiologicTransitionClassifierExample.output,
    });
  });

  it("keeps high-expectancy countries in the degenerative age under the three-stage framework", () => {
    expect(
      calculateOmranEpidemiologicTransitionClassifier({
        lifeExpectancyYears: 80,
        framework: "omran-three-stage",
      }).stage,
    ).toBe("age-of-degenerative-and-man-made-diseases");
    expect(
      calculateOmranEpidemiologicTransitionClassifier({
        lifeExpectancyYears: 35,
      }).stage,
    ).toBe("age-of-pestilence-and-famine");
  });

  it("rejects non-positive life expectancy", () => {
    expect(
      runOmranEpidemiologicTransitionClassifier({ lifeExpectancyYears: 0 }).ok,
    ).toBe(false);
    expect(
      runOmranEpidemiologicTransitionClassifier({ lifeExpectancyYears: -10 })
        .ok,
    ).toBe(false);
  });
});
