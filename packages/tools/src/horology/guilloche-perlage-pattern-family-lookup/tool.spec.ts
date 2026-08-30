import { describe, expect, it } from "vitest";
import {
  lookupWatchPatternFamily,
  runWatchPattern,
  watchPatternExample,
} from "./tool.js";

describe("guilloché and perlage pattern-family lookup", () => {
  it("reproduces the canonical taxonomy statement", () => {
    expect(runWatchPattern(watchPatternExample.input)).toEqual({
      ok: true,
      output: watchPatternExample.output,
    });
  });

  it("defines guilloché as a broader engraving technique", () => {
    expect(
      lookupWatchPatternFamily({ patternFocus: "guilloche" }).verifiedStatement,
    ).toContain("intersecting");
  });

  it("places Clous de Paris inside the guilloché family", () => {
    expect(
      lookupWatchPatternFamily({ patternFocus: "clousDeParis" }).keyDate,
    ).toBe("guilloché motif");
  });

  it("defines perlage as a separate circular finish", () => {
    expect(
      lookupWatchPatternFamily({ patternFocus: "perlage" }).verifiedStatement,
    ).toContain("interlaced circles");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runWatchPattern({ patternFocus: "cotes" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "patternFocus" }] },
      ok: false,
    });
  });
});
