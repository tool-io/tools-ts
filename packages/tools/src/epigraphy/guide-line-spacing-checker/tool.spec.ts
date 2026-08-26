import { describe, expect, it } from "vitest";
import {
  guideLineSpacingCheckerExample,
  runGuideLineSpacingChecker,
} from "./tool.js";

describe("guide-line-spacing-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGuideLineSpacingChecker(guideLineSpacingCheckerExample.input),
    ).toEqual({
      ok: true,
      output: guideLineSpacingCheckerExample.output,
    });
  });

  it("flags an irregular grid outside tolerance", () => {
    const result = runGuideLineSpacingChecker({ spacingListMm: [30, 30, 45] });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.meanSpacingMm as number).toBe(35);
    expect(result.output.uniformSpacing as boolean).toBe(false);
  });

  it("rejects an empty spacing list", () => {
    expect(runGuideLineSpacingChecker({ spacingListMm: [] }).ok).toBe(false);
  });
});
