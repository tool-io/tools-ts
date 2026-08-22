import { describe, expect, it } from "vitest";
import { runFleschReadingEase } from "./tool.js";
describe("flesch reading ease calculator", () => {
  it("computes a known score", () => {
    const r = runFleschReadingEase({ sentences: 5, syllables: 40, words: 25 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.score).toBeCloseTo(66.4, 6);
  });
  it("rejects zero word count through execution", () => {
    expect(
      runFleschReadingEase({ sentences: 1, syllables: 1, words: 0 }).ok,
    ).toBe(false);
  });
});
