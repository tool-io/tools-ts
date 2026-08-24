import { describe, expect, it } from "vitest";
import {
  calculateOralHistoryAbstractLimitFinder,
  oralHistoryAbstractLimitFinderExample,
  runOralHistoryAbstractLimitFinder,
} from "./tool.js";

describe("archival-studies/oral-history-abstract-limit-finder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOralHistoryAbstractLimitFinder(
        oralHistoryAbstractLimitFinderExample.input,
      ),
    ).toEqual({
      ok: true,
      output: oralHistoryAbstractLimitFinderExample.output,
    });
  });

  it("keeps a short abstract intact without truncation", () => {
    const result = calculateOralHistoryAbstractLimitFinder({
      abstractText: "One short sentence here",
      wordLimit: 10,
    });
    expect(result.truncated).toBe(false);
    expect(result.keptWordCount).toBe(4);
    expect(result.truncatedAbstract).toBe("One short sentence here");
  });

  it("rejects blank abstracts", () => {
    expect(
      runOralHistoryAbstractLimitFinder({
        abstractText: "   ",
      }).ok,
    ).toBe(false);
  });
});
