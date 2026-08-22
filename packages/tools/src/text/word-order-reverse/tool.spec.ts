import { describe, expect, it } from "vitest";
import { runWordOrderReverse } from "./tool.js";

describe("Word Order Reverse Tool", () => {
  it("calculates the canonical example", () =>
    expect(runWordOrderReverse({ text: "the quick brown fox jumps" })).toEqual({
      ok: true,
      output: { result: "jumps fox brown quick the" },
    }));

  it("keeps a single word unchanged", () =>
    expect(runWordOrderReverse({ text: "hello" })).toEqual({
      ok: true,
      output: { result: "hello" },
    }));

  it("swaps two words", () =>
    expect(runWordOrderReverse({ text: "first second" })).toEqual({
      ok: true,
      output: { result: "second first" },
    }));

  it("collapses runs of whitespace to single spaces", () =>
    expect(runWordOrderReverse({ text: "one   two\tthree\nfour" })).toEqual({
      ok: true,
      output: { result: "four three two one" },
    }));

  it("trims leading and trailing whitespace", () =>
    expect(runWordOrderReverse({ text: "  alpha beta  " })).toEqual({
      ok: true,
      output: { result: "beta alpha" },
    }));

  it("returns an empty result for empty text", () =>
    expect(runWordOrderReverse({ text: "" })).toEqual({
      ok: true,
      output: { result: "" },
    }));

  it("returns an empty result for whitespace-only text", () =>
    expect(runWordOrderReverse({ text: " \t\n " })).toEqual({
      ok: true,
      output: { result: "" },
    }));

  it("rejects a missing field", () =>
    expect(runWordOrderReverse({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runWordOrderReverse({ text: 7 }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runWordOrderReverse({ text: "a b", words: ["a"] }).ok).toBe(false));

  it("rejects a null input object", () =>
    expect(runWordOrderReverse(null).ok).toBe(false));
});
