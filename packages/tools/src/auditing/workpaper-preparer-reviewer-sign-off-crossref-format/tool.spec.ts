import { describe, expect, it } from "vitest";
import {
  checkWorkpaperSignoffFormat,
  runWorkpaperSignoff,
  workpaperSignoffExample,
} from "./tool.js";

describe("workpaper preparer reviewer sign-off format", () => {
  it("reproduces its canonical example", () => {
    expect(runWorkpaperSignoff(workpaperSignoffExample.input)).toEqual({
      ok: true,
      output: workpaperSignoffExample.output,
    });
  });

  it("flags the same person as preparer and reviewer", () => {
    expect(
      checkWorkpaperSignoffFormat({
        preparer: "Alex Chen",
        reference: "AR-12",
        reviewDate: "2026-03-18",
        reviewer: "alex chen",
        signedDate: "2026-03-18",
      }).issues,
    ).toEqual(["preparer_and_reviewer_must_differ"]);
  });

  it("flags mismatched sign-off dates", () => {
    expect(
      checkWorkpaperSignoffFormat({
        preparer: "Alex Chen",
        reference: "AR-12",
        reviewDate: "2026-03-18",
        reviewer: "Jordan Lee",
        signedDate: "2026-03-19",
      }).complete,
    ).toBe(false);
  });

  it("rejects a blank workpaper reference", () => {
    expect(
      runWorkpaperSignoff({
        preparer: "Alex Chen",
        reference: " ",
        reviewDate: "2026-03-18",
        reviewer: "Jordan Lee",
        signedDate: "2026-03-18",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "signoff_field_required", field: "reference" }],
      },
      ok: false,
    });
  });
});
