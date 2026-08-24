import { describe, expect, it } from "vitest";
import {
  bagitRequiredTagCheckerExample,
  calculateBagitRequiredTagChecker,
  runBagitRequiredTagChecker,
} from "./tool.js";

describe("archival-studies/bagit-required-tag-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBagitRequiredTagChecker(bagitRequiredTagCheckerExample.input),
    ).toEqual({
      ok: true,
      output: bagitRequiredTagCheckerExample.output,
    });
  });

  it("passes when every required tag is present", () => {
    expect(
      calculateBagitRequiredTagChecker({
        requiredTags: ["Bagging-Date", "External-Identifier"],
        presentTags: ["External-Identifier", "Bagging-Date"],
      }),
    ).toEqual({ missingTags: [], allPresent: true });
  });

  it("compares metadata element names without case sensitivity", () => {
    expect(
      calculateBagitRequiredTagChecker({
        requiredTags: ["Bagging-Date", "Payload-Oxum"],
        presentTags: ["bagging-date", "PAYLOAD-OXUM"],
      }),
    ).toEqual({ missingTags: [], allPresent: true });
  });

  it("rejects empty or non-string tag entries", () => {
    expect(
      runBagitRequiredTagChecker({
        requiredTags: [""],
        presentTags: [],
      }).ok,
    ).toBe(false);
  });
});
