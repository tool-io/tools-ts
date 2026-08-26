import { describe, expect, it } from "vitest";
import {
  calculateCohortCenturyTokenClassifier,
  cohortCenturyTokenClassifierExample,
  runCohortCenturyTokenClassifier,
} from "./tool.js";

describe("epigraphy/cohort-century-token-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCohortCenturyTokenClassifier(
        cohortCenturyTokenClassifierExample.input,
      ),
    ).toEqual({ ok: true, output: cohortCenturyTokenClassifierExample.output });
  });

  it("recognizes abbreviated and mixed unit tokens", () => {
    expect(
      calculateCohortCenturyTokenClassifier({ text: "cen. prima coh. VII" }),
    ).toEqual({
      cohortMentions: 1,
      centuryMentions: 1,
      classification: "mixed",
    });
    expect(
      calculateCohortCenturyTokenClassifier({ text: "centuria Primipili" })
        .classification,
    ).toBe("century");
  });

  it("reports none for civilian texts", () => {
    expect(
      calculateCohortCenturyTokenClassifier({ text: "dis manibus" }),
    ).toEqual({
      cohortMentions: 0,
      centuryMentions: 0,
      classification: "none",
    });
  });

  it("rejects blank text", () => {
    expect(runCohortCenturyTokenClassifier({ text: "" }).ok).toBe(false);
  });
});
