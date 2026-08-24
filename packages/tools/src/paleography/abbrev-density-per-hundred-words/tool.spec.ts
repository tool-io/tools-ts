import { describe, expect, it } from "vitest";
import {
  abbrevDensityPerHundredWordsExample,
  runAbbrevDensityPerHundredWords,
} from "./tool.js";

describe("abbrev-density-per-hundred-words", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAbbrevDensityPerHundredWords(
        abbrevDensityPerHundredWordsExample.input,
      ),
    ).toEqual({
      ok: true,
      output: abbrevDensityPerHundredWordsExample.output,
    });
  });

  it("bands university-style density as dense", () => {
    const result = runAbbrevDensityPerHundredWords({
      wordCount: 100,
      abbreviationCount: 20,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.abbreviationsPerHundredWords).toBe(20);
    expect(result.output.densityBand).toBe("dense");
  });

  it("rejects a zero-word sample", () => {
    expect(
      runAbbrevDensityPerHundredWords({ wordCount: 0, abbreviationCount: 0 })
        .ok,
    ).toBe(false);
  });
});
