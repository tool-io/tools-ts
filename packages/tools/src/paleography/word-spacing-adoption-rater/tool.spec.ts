import { describe, expect, it } from "vitest";
import {
  runWordSpacingAdoptionRater,
  wordSpacingAdoptionRaterExample,
} from "./tool.js";

describe("word-spacing-adoption-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWordSpacingAdoptionRater(wordSpacingAdoptionRaterExample.input),
    ).toEqual({ ok: true, output: wordSpacingAdoptionRaterExample.output });
  });

  it("flags continua in the twelfth century as atypical", () => {
    const result = runWordSpacingAdoptionRater({
      century: 12,
      spacingConvention: "scriptio_continua",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.inTypicalPeriod as boolean).toBe(false);
    expect(result.output.separationScore as number).toBe(0);
  });

  it("rejects non-positive centuries", () => {
    expect(
      runWordSpacingAdoptionRater({
        century: 0,
        spacingConvention: "full_word_separation",
      }).ok,
    ).toBe(false);
  });
});
