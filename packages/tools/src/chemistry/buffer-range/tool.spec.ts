import { describe, expect, it } from "vitest";
import { runBufferRange } from "./tool.js";

describe("Buffer Range Calculator", () => {
  it("calculates a valid result", () => {
    expect(runBufferRange({ pka: 4.76 })).toEqual({
      ok: true,
      output: { lower: 3.76, upper: 5.76 },
    });
  });

  it("rejects invalid input", () =>
    expect(runBufferRange(null).ok).toBe(false));
});
