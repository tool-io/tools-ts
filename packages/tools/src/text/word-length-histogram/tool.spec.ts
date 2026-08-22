import { describe, expect, it } from "vitest";
import { runWordLengthHistogram } from "./tool.js";

describe("Word Length Histogram Tool", () => {
  it("calculates a valid result", () => {
    expect(runWordLengthHistogram({ text: "to be or not to be" })).toEqual({
      ok: true,
      output: { histogram: { "2": 5, "3": 1 } },
    });
  });

  it("returns an empty histogram for whitespace-only text", () => {
    expect(runWordLengthHistogram({ text: "   " })).toEqual({
      ok: true,
      output: { histogram: {} },
    });
  });

  it("rejects invalid input", () =>
    expect(runWordLengthHistogram(null).ok).toBe(false));
});
