import { describe, expect, it } from "vitest";
import {
  calculateVerseLinePipeCounter,
  verseLinePipeCounterExample,
  runVerseLinePipeCounter,
} from "./tool.js";

describe("epigraphy/verse-line-pipe-counter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVerseLinePipeCounter(verseLinePipeCounterExample.input)).toEqual({
      ok: true,
      output: verseLinePipeCounterExample.output,
    });
  });

  it("counts undivided verse as a single line", () => {
    expect(
      calculateVerseLinePipeCounter({ verse: "SIT TIBI TERRA LEVIS" }),
    ).toEqual({ pipeCount: 0, verseLineCount: 1 });
  });

  it("handles several dividers", () => {
    expect(calculateVerseLinePipeCounter({ verse: "a|b|c|d" })).toEqual({
      pipeCount: 3,
      verseLineCount: 4,
    });
  });

  it("rejects empty or blank verse", () => {
    expect(runVerseLinePipeCounter({ verse: "" }).ok).toBe(false);
    expect(runVerseLinePipeCounter({ verse: "   " }).ok).toBe(false);
  });
});
