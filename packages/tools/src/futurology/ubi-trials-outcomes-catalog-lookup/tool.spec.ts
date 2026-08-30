import { describe, expect, it } from "vitest";
import {
  buildUbiTrialsOutcomesCatalog,
  runUbiTrialsCatalog,
  ubiTrialsCatalogExample,
} from "./tool.js";

describe("UBI trials outcomes catalog lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runUbiTrialsCatalog(ubiTrialsCatalogExample.input)).toEqual({
      ok: true,
      output: ubiTrialsCatalogExample.output,
    });
  });

  it("marks a complete caller-supplied catalog", () => {
    expect(
      buildUbiTrialsOutcomesCatalog({
        reportedOutcomes: ["Outcome"],
        studyDesigns: ["RCT"],
        trialNames: ["Trial"],
      }).catalogComplete,
    ).toBe(true);
  });

  it("preserves missing outcomes as not supplied", () => {
    expect(
      buildUbiTrialsOutcomesCatalog({
        reportedOutcomes: [""],
        studyDesigns: ["RCT"],
        trialNames: ["Trial"],
      }).catalogEntries,
    ).toEqual(["Trial | design=RCT | outcome=not supplied"]);
  });

  it("rejects mismatched outcome counts", () => {
    expect(
      runUbiTrialsCatalog({
        reportedOutcomes: [],
        studyDesigns: ["RCT"],
        trialNames: ["Trial"],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "outcomes_length_mismatch", field: "reportedOutcomes" },
        ],
      },
      ok: false,
    });
  });
});
