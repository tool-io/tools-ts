import { describe, expect, it } from "vitest";
import {
  otherMatterSelectorExample,
  runOtherMatterSelector,
  selectEmphasisOrOtherMatter,
} from "./tool.js";

describe("emphasis or other matter selector", () => {
  it("reproduces its canonical example", () => {
    expect(runOtherMatterSelector(otherMatterSelectorExample.input)).toEqual({
      ok: true,
      output: otherMatterSelectorExample.output,
    });
  });

  it("can select both paragraph types", () => {
    expect(
      selectEmphasisOrOtherMatter({
        fundamentalToUnderstandingFinancialStatements: true,
        matterPresentedOrDisclosed: true,
        otherMatterRelevantToUsers: true,
        requiresModifiedOpinion: false,
      }).selection,
    ).toBe("both");
  });

  it("does not use either paragraph in place of a modified opinion", () => {
    expect(
      selectEmphasisOrOtherMatter({
        fundamentalToUnderstandingFinancialStatements: true,
        matterPresentedOrDisclosed: true,
        otherMatterRelevantToUsers: true,
        requiresModifiedOpinion: true,
      }).selection,
    ).toBe("modified_opinion");
  });

  it("rejects an undisclosed emphasis-of-matter candidate", () => {
    expect(
      runOtherMatterSelector({
        fundamentalToUnderstandingFinancialStatements: true,
        matterPresentedOrDisclosed: false,
        otherMatterRelevantToUsers: false,
        requiresModifiedOpinion: false,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "emphasis_matter_not_presented",
            field: "matterPresentedOrDisclosed",
          },
        ],
      },
      ok: false,
    });
  });
});
