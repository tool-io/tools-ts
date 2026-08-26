import { describe, expect, it } from "vitest";
import {
  rtiHighlightCountCheckerExample,
  runRtiHighlightCountChecker,
} from "./tool.js";

describe("rti-highlight-count-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRtiHighlightCountChecker(rtiHighlightCountCheckerExample.input),
    ).toEqual({
      ok: true,
      output: rtiHighlightCountCheckerExample.output,
    });
  });

  it("marks a capture below the default minimum as insufficient", () => {
    const result = runRtiHighlightCountChecker({ highlightCount: 10 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.sufficient as boolean).toBe(false);
    expect(result.output.surplusCount as number).toBe(-14);
    expect(result.output.adequacyRatio as number).toBe(0.4166666666666667);
  });

  it("rejects a fractional highlight count", () => {
    expect(runRtiHighlightCountChecker({ highlightCount: 32.5 }).ok).toBe(
      false,
    );
  });
});
