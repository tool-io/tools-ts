import { describe, expect, it } from "vitest";
import {
  runSentenceLengthAverage,
  sentenceLengthAverageExample,
} from "./tool.js";

describe("Average Sentence Length Calculator", () => {
  it("calculates the canonical example", () =>
    expect(
      runSentenceLengthAverage(sentenceLengthAverageExample.input),
    ).toEqual({ ok: true, output: sentenceLengthAverageExample.output }));
  it("averages unequal sentence lengths", () =>
    expect(
      runSentenceLengthAverage({
        text: "One two three four five. Six seven eight!",
      }),
    ).toEqual({ ok: true, output: { averageWords: 4 } }));
  it("does not split decimals mid-number", () =>
    expect(runSentenceLengthAverage({ text: "Pi is 3.14 today" })).toEqual({
      ok: true,
      output: { averageWords: 4 },
    }));
  it("treats any whitespace between sentences as a separator", () =>
    expect(
      runSentenceLengthAverage({
        text: "Go now.\nStop here?\tCome back!",
      }),
    ).toEqual({ ok: true, output: { averageWords: 2 } }));
  it("collapses repeated terminal punctuation", () =>
    expect(runSentenceLengthAverage({ text: "Hi there! Wait..." })).toEqual({
      ok: true,
      output: { averageWords: 1.5 },
    }));
  it("rejects text without sentences", () =>
    expect(runSentenceLengthAverage({ text: "   !!!   " }).ok).toBe(false));
  it("rejects empty and whitespace-only text", () => {
    expect(runSentenceLengthAverage({ text: "" }).ok).toBe(false);
    expect(runSentenceLengthAverage({ text: " \n\t " }).ok).toBe(false);
  });
  it("rejects malformed input", () => {
    expect(runSentenceLengthAverage(null).ok).toBe(false);
    expect(runSentenceLengthAverage({}).ok).toBe(false);
    expect(runSentenceLengthAverage({ text: 3 }).ok).toBe(false);
  });
});
