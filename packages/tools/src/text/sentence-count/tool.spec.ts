import { describe, expect, it } from "vitest";
import { runSentenceCount } from "./tool.js";
describe("Sentence Count Tool", () => {
  it("calculates a valid result", () => {
    expect(runSentenceCount({ text: "One. Two? Three!" })).toEqual({
      ok: true,
      output: { sentences: 3 },
    });
  });
  it("rejects invalid input", () =>
    expect(runSentenceCount(null).ok).toBe(false));
});
