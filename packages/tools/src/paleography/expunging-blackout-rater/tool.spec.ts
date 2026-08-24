import { describe, expect, it } from "vitest";
import {
  expungingBlackoutRaterExample,
  runExpungingBlackoutRater,
} from "./tool.js";

describe("expunging-blackout-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runExpungingBlackoutRater(expungingBlackoutRaterExample.input),
    ).toEqual({
      ok: true,
      output: expungingBlackoutRaterExample.output,
    });
  });

  it("records a declared whole-entry blackout as complete", () => {
    const result = runExpungingBlackoutRater({
      totalLineCount: 30,
      expungedLineCount: 2,
      wholeEntryExpunged: true,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.fullyBlackedOut).toBe(true);
    expect(result.output.severityBand).toBe("spot_expunging");
  });

  it("rejects expunged counts above the total", () => {
    expect(
      runExpungingBlackoutRater({ totalLineCount: 5, expungedLineCount: 6 }).ok,
    ).toBe(false);
  });
});
