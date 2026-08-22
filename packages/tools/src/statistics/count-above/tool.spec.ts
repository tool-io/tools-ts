import { describe, expect, it } from "vitest";
import { runCountAbove } from "./tool.js";

describe("Count Above Threshold Tool", () => {
  it("calculates a valid result", () => {
    expect(runCountAbove({ threshold: 10, values: [5, 10, 11, 20] })).toEqual({
      ok: true,
      output: { count: 2 },
    });
  });

  it("counts nothing on an empty list", () => {
    expect(runCountAbove({ threshold: 0, values: [] })).toEqual({
      ok: true,
      output: { count: 0 },
    });
  });

  it("rejects invalid input", () => expect(runCountAbove(null).ok).toBe(false));
});
