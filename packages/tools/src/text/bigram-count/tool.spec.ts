import { describe, expect, it } from "vitest";
import { runBigramCount } from "./tool.js";

describe("Bigram Count Tool", () => {
  it("calculates a valid result", () => {
    expect(runBigramCount({ text: "the cat sat on the mat" })).toEqual({
      ok: true,
      output: {
        bigrams: {
          "cat sat": 1,
          "on the": 1,
          "sat on": 1,
          "the cat": 1,
          "the mat": 1,
        },
      },
    });
  });

  it("counts repeated bigrams", () => {
    expect(runBigramCount({ text: "go go go" })).toEqual({
      ok: true,
      output: { bigrams: { "go go": 2 } },
    });
  });

  it("rejects invalid input", () =>
    expect(runBigramCount(null).ok).toBe(false));
});
