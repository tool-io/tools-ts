import { describe, expect, it } from "vitest";
import { runWhitespaceCount, whitespaceCountExample } from "./tool.js";

describe("Whitespace Count Tool", () => {
  it("calculates the canonical example", () =>
    expect(runWhitespaceCount(whitespaceCountExample.input)).toEqual({
      ok: true,
      output: whitespaceCountExample.output,
    }));
  it("returns zero for empty text", () =>
    expect(runWhitespaceCount({ text: "" })).toEqual({
      ok: true,
      output: { whitespaceCount: 0 },
    }));
  it("counts every kind of escaped whitespace once", () =>
    expect(runWhitespaceCount({ text: " \t\n\r\v\f\u00a0" })).toEqual({
      ok: true,
      output: { whitespaceCount: 7 },
    }));
  it("ignores visible characters entirely", () =>
    expect(runWhitespaceCount({ text: "abc123!?" })).toEqual({
      ok: true,
      output: { whitespaceCount: 0 },
    }));
  it("counts runs of adjacent whitespace individually", () =>
    expect(runWhitespaceCount({ text: "a   b" })).toEqual({
      ok: true,
      output: { whitespaceCount: 3 },
    }));
  it("rejects malformed input", () => {
    expect(runWhitespaceCount(null).ok).toBe(false);
    expect(runWhitespaceCount({}).ok).toBe(false);
    expect(runWhitespaceCount({ text: 7 }).ok).toBe(false);
    expect(runWhitespaceCount({ text: "x", extra: true }).ok).toBe(false);
  });
});
