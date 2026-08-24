import { describe, expect, it } from "vitest";
import {
  dominicalLetterFinderExample,
  runDominicalLetterFinder,
} from "./tool.js";

describe("dominical-letter-finder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDominicalLetterFinder(dominicalLetterFinderExample.input),
    ).toEqual({ ok: true, output: dominicalLetterFinderExample.output });
  });

  it("gives Julian 622 a single letter C on a Friday new year", () => {
    expect(runDominicalLetterFinder({ year: 622, calendar: "julian" })).toEqual(
      {
        ok: true,
        output: {
          dominicalLetter: "C",
          januaryFirstWeekday: "friday",
          isLeapYear: false,
        },
      },
    );
  });

  it("rejects a non-positive year", () => {
    expect(runDominicalLetterFinder({ year: -5 }).ok).toBe(false);
  });
});
