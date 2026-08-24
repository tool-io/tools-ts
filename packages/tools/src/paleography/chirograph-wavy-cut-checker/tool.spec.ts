import { describe, expect, it } from "vitest";
import {
  chirographWavyCutCheckerExample,
  runChirographWavyCutChecker,
} from "./tool.js";

describe("chirograph-wavy-cut-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runChirographWavyCutChecker(chirographWavyCutCheckerExample.input),
    ).toEqual({
      ok: true,
      output: chirographWavyCutCheckerExample.output,
    });
  });

  it("is indeterminate when no wavy cut is visible", () => {
    const result = runChirographWavyCutChecker({
      lowerHalfLetterCount: 4,
      upperHalfLetterCount: 4,
      wavyCutVisible: false,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.verdict).toBe("indeterminate");
    expect(result.output.letterBalanceRatio as number).toBe(1);
  });

  it("rejects two halves with no recorded letters", () => {
    expect(
      runChirographWavyCutChecker({
        lowerHalfLetterCount: 0,
        upperHalfLetterCount: 0,
        wavyCutVisible: true,
      }).ok,
    ).toBe(false);
  });
});
