import { describe, expect, it } from "vitest";
import {
  checkUnmodifiedOpinionCoreElements,
  runUnmodifiedOpinion,
  unmodifiedOpinionExample,
} from "./tool.js";

describe("unmodified opinion core report elements", () => {
  it("reproduces its canonical example", () => {
    expect(runUnmodifiedOpinion(unmodifiedOpinionExample.input)).toEqual({
      ok: true,
      output: unmodifiedOpinionExample.output,
    });
  });

  it("requires an other-matter section only when applicable", () => {
    expect(
      checkUnmodifiedOpinionCoreElements({
        auditorResponsibilitiesIncluded: true,
        basisForOpinionIncluded: true,
        managementResponsibilitiesIncluded: true,
        opinionSectionIncluded: true,
        otherMatterIncluded: false,
        otherMatterRequired: true,
      }).missingElements,
    ).toEqual(["required other-matter section"]);
  });

  it("reports missing core responsibility sections", () => {
    expect(
      checkUnmodifiedOpinionCoreElements({
        auditorResponsibilitiesIncluded: false,
        basisForOpinionIncluded: true,
        managementResponsibilitiesIncluded: false,
        opinionSectionIncluded: true,
        otherMatterIncluded: false,
        otherMatterRequired: false,
      }).missingElements,
    ).toEqual([
      "management responsibilities section",
      "auditor responsibilities section",
    ]);
  });
});
