import { describe, expect, it } from "vitest";
import {
  checkEngagementLetterInclusions,
  engagementLetterInclusionExample,
  runEngagementLetterInclusion,
} from "./tool.js";

describe("engagement letter inclusion elements checklist", () => {
  it("reproduces its canonical example", () => {
    expect(
      runEngagementLetterInclusion(engagementLetterInclusionExample.input),
    ).toEqual({ ok: true, output: engagementLetterInclusionExample.output });
  });

  it("matches trimmed labels without case sensitivity", () => {
    expect(
      checkEngagementLetterInclusions({
        includedElements: [" Scope ", "FEES"],
        requiredElements: ["scope", "fees"],
      }),
    ).toEqual({
      complete: true,
      includedCount: 2,
      missingCount: 0,
      missingElements: [],
      requiredCount: 2,
    });
  });

  it("deduplicates repeated required labels", () => {
    expect(
      checkEngagementLetterInclusions({
        includedElements: ["Scope"],
        requiredElements: ["Scope", "scope"],
      }).requiredCount,
    ).toBe(1);
  });

  it("rejects an empty required list with a stable code", () => {
    expect(
      runEngagementLetterInclusion({
        includedElements: [],
        requiredElements: [],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "required_elements_required", field: "requiredElements" },
        ],
      },
      ok: false,
    });
  });
});
