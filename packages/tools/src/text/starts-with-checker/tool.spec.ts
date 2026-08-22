import { describe, expect, it } from "vitest";
import { runStartsWithChecker } from "./tool.js";

describe("Starts With Checker", () => {
  it("calculates the canonical example", () =>
    expect(
      runStartsWithChecker({ text: "TypeScript rocks", value: "TypeScript" }),
    ).toEqual({ ok: true, output: { startsWith: true } }));

  it("reports false for a non-matching prefix", () =>
    expect(
      runStartsWithChecker({ text: "TypeScript rocks", value: "JavaScript" }),
    ).toEqual({
      ok: true,
      output: { startsWith: false },
    }));

  it("is case-sensitive", () =>
    expect(
      runStartsWithChecker({ text: "TypeScript rocks", value: "typescript" }),
    ).toEqual({
      ok: true,
      output: { startsWith: false },
    }));

  it("matches an empty value as a prefix", () =>
    expect(runStartsWithChecker({ text: "anything", value: "" })).toEqual({
      ok: true,
      output: { startsWith: true },
    }));

  it("matches when the value equals the whole text", () =>
    expect(runStartsWithChecker({ text: "whole", value: "whole" })).toEqual({
      ok: true,
      output: { startsWith: true },
    }));

  it("reports false when the match is only at the end", () =>
    expect(runStartsWithChecker({ text: "file.txt", value: ".txt" })).toEqual({
      ok: true,
      output: { startsWith: false },
    }));

  it("rejects a missing value field", () =>
    expect(runStartsWithChecker({ text: "abc" }).ok).toBe(false));

  it("rejects a missing text field", () =>
    expect(runStartsWithChecker({ value: "abc" }).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runStartsWithChecker({ text: null, value: "a" }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(
      runStartsWithChecker({ text: "a", value: "b", prefix: "c" }).ok,
    ).toBe(false));

  it("rejects a null input object", () =>
    expect(runStartsWithChecker(null).ok).toBe(false));
});
