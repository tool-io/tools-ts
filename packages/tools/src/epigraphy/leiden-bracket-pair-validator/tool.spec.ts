import { describe, expect, it } from "vitest";
import {
  calculateLeidenBracketPairValidator,
  leidenBracketPairValidatorExample,
  runLeidenBracketPairValidator,
} from "./tool.js";

describe("epigraphy/leiden-bracket-pair-validator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLeidenBracketPairValidator(leidenBracketPairValidatorExample.input),
    ).toEqual({ ok: true, output: leidenBracketPairValidatorExample.output });
  });

  it("supports nesting and reports its depth", () => {
    expect(
      calculateLeidenBracketPairValidator({ transcription: "a[b[c]d]e" }),
    ).toEqual({
      balanced: true,
      openCount: 2,
      closeCount: 2,
      maxDepth: 2,
      firstErrorPosition: -1,
    });
  });

  it("pinpoints unmatched brackets", () => {
    expect(
      calculateLeidenBracketPairValidator({ transcription: "ab]cd" })
        .firstErrorPosition,
    ).toBe(2);
    expect(
      calculateLeidenBracketPairValidator({ transcription: "ab[cd" })
        .firstErrorPosition,
    ).toBe(2);
  });

  it("rejects empty input", () => {
    expect(runLeidenBracketPairValidator({ transcription: "" }).ok).toBe(false);
  });
});
