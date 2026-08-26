import { describe, expect, it } from "vitest";
import {
  fistulaeCalxNoteGeneratorExample,
  runFistulaeCalxNoteGenerator,
} from "./tool.js";

describe("fistulae-calx-note-generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFistulaeCalxNoteGenerator(fistulaeCalxNoteGeneratorExample.input),
    ).toEqual({
      ok: true,
      output: fistulaeCalxNoteGeneratorExample.output,
    });
  });

  it("notes the absence of a calx mark by default", () => {
    expect(runFistulaeCalxNoteGenerator({ stampText: "L AE LI F" })).toEqual({
      ok: true,
      output: {
        note: 'Lead fistula stamp reading "L AE LI F" — no calx mark was noted beside the stamp.',
        includesCalxMark: false,
      },
    });
  });
  it("rejects empty stamp readings", () => {
    expect(runFistulaeCalxNoteGenerator({ stampText: "  " }).ok).toBe(false);
  });
});
