import { describe, expect, it } from "vitest";
import {
  calculateLeidenHalfbracketChecker,
  leidenHalfbracketCheckerExample,
  runLeidenHalfbracketChecker,
} from "./tool.js";

describe("epigraphy/leiden-halfbracket-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLeidenHalfbracketChecker(leidenHalfbracketCheckerExample.input),
    ).toEqual({ ok: true, output: leidenHalfbracketCheckerExample.output });
  });

  it("pairs top and bottom corners independently", () => {
    expect(
      calculateLeidenHalfbracketChecker({
        transcription: "\u231CDI\u231DO\u231ES\u231F",
      }),
    ).toEqual({
      openTopCount: 1,
      closeTopCount: 1,
      openBottomCount: 1,
      closeBottomCount: 1,
      balanced: true,
      firstErrorPosition: -1,
    });
  });

  it("flags a corner closed with the wrong orientation", () => {
    const result = calculateLeidenHalfbracketChecker({
      transcription: "\u231CA\u231EB\u231D",
    });
    expect(result.balanced).toBe(false);
    expect(result.firstErrorPosition).toBe(4);
    expect(result.closeBottomCount).toBe(0);
  });

  it("rejects empty input", () => {
    expect(runLeidenHalfbracketChecker({ transcription: "" }).ok).toBe(false);
  });
});
