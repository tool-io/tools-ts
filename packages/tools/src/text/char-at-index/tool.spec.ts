import { describe, expect, it } from "vitest";
import { runCharAtIndex } from "./tool.js";

describe("Character at Index Tool", () => {
  it("calculates a valid result", () => {
    expect(runCharAtIndex({ index: 1, text: "abc" })).toEqual({
      ok: true,
      output: { character: "b" },
    });
  });

  it("returns one code point for surrogate pairs", () => {
    expect(runCharAtIndex({ index: 1, text: "a🙂b" })).toEqual({
      ok: true,
      output: { character: "🙂" },
    });
  });

  it("rejects out-of-range indexes", () => {
    expect(runCharAtIndex({ index: 3, text: "abc" })).toMatchObject({
      error: { issues: [{ code: "invalid_value", field: "index" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runCharAtIndex(null).ok).toBe(false));
});
