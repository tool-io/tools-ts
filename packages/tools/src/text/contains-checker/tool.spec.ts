import { describe, expect, it } from "vitest";
import { runContainsChecker } from "./tool.js";

describe("Contains Checker", () => {
  it("calculates the canonical example", () =>
    expect(
      runContainsChecker({ text: "The quick brown fox", value: "brown fox" }),
    ).toEqual({ ok: true, output: { contains: true } }));

  it("reports false when the value is absent", () =>
    expect(
      runContainsChecker({ text: "The quick brown fox", value: "cat" }),
    ).toEqual({
      ok: true,
      output: { contains: false },
    }));

  it("is case-sensitive", () =>
    expect(
      runContainsChecker({ text: "The Quick Brown Fox", value: "brown fox" }),
    ).toEqual({
      ok: true,
      output: { contains: false },
    }));

  it("matches an empty value as contained", () =>
    expect(runContainsChecker({ text: "", value: "" })).toEqual({
      ok: true,
      output: { contains: true },
    }));

  it("matches a single character", () =>
    expect(runContainsChecker({ text: "hello", value: "e" })).toEqual({
      ok: true,
      output: { contains: true },
    }));

  it("does not treat regex metacharacters as patterns", () =>
    expect(runContainsChecker({ text: "a.c", value: "." })).toEqual({
      ok: true,
      output: { contains: true },
    }));

  it("rejects a missing value field", () =>
    expect(runContainsChecker({ text: "abc" }).ok).toBe(false));

  it("rejects a missing text field", () =>
    expect(runContainsChecker({ value: "abc" }).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runContainsChecker({ text: 5, value: "5" }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runContainsChecker({ text: "a", value: "b", needle: "c" }).ok).toBe(
      false,
    ));

  it("rejects a null input object", () =>
    expect(runContainsChecker(null).ok).toBe(false));
});
