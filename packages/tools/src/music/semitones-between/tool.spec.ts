import { describe, expect, it } from "vitest";
import { runSemitonesBetween } from "./tool.js";

describe("Semitones Between Notes Calculator", () => {
  it("calculates a valid result", () => {
    expect(runSemitonesBetween({ fromNote: "C4", toNote: "E4" })).toEqual({
      ok: true,
      output: { semitones: 4 },
    });
  });

  it("supports accidentals and octaves", () => {
    expect(runSemitonesBetween({ fromNote: "Bb3", toNote: "F#4" })).toEqual({
      ok: true,
      output: { semitones: 8 },
    });
  });

  it("returns negative when the target is lower", () => {
    expect(runSemitonesBetween({ fromNote: "E4", toNote: "C4" })).toEqual({
      ok: true,
      output: { semitones: -4 },
    });
  });

  it("rejects invalid input", () =>
    expect(runSemitonesBetween(null).ok).toBe(false));
});
