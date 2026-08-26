import { describe, expect, it } from "vitest";
import {
  calculateSuppliedLetterBracketCounter,
  suppliedLetterBracketCounterExample,
  runSuppliedLetterBracketCounter,
} from "./tool.js";

describe("epigraphy/supplied-letter-bracket-counter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSuppliedLetterBracketCounter(
        suppliedLetterBracketCounterExample.input,
      ),
    ).toEqual({ ok: true, output: suppliedLetterBracketCounterExample.output });
  });

  it("counts multiple restorations and Greek letters", () => {
    expect(
      calculateSuppliedLetterBracketCounter({ transcription: "[V]·S·[LM]" }),
    ).toEqual({ bracketPairCount: 2, suppliedLetterCount: 3 });
    expect(
      calculateSuppliedLetterBracketCounter({ transcription: "[ΚΣ]" })
        .suppliedLetterCount,
    ).toBe(2);
  });

  it("ignores text outside brackets", () => {
    expect(
      calculateSuppliedLetterBracketCounter({ transcription: "DIS MANIBVS" }),
    ).toEqual({ bracketPairCount: 0, suppliedLetterCount: 0 });
  });

  it("rejects empty input", () => {
    expect(runSuppliedLetterBracketCounter({ transcription: "" }).ok).toBe(
      false,
    );
    expect(
      runSuppliedLetterBracketCounter({ transcription: "DI[S MA" }).ok,
    ).toBe(false);
    expect(
      runSuppliedLetterBracketCounter({ transcription: "DIS] MA" }).ok,
    ).toBe(false);
  });
});
