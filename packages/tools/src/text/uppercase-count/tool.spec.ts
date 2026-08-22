import { describe, expect, it } from "vitest";
import { runUppercaseCount } from "./tool.js";

describe("Uppercase Count Tool", () => {
  it("calculates the canonical example", () =>
    expect(runUppercaseCount({ text: "Hello World Ünïcode" })).toEqual({
      ok: true,
      output: { uppercaseCount: 3 },
    }));

  it("counts zero uppercase letters in lowercase text", () =>
    expect(runUppercaseCount({ text: "no capitals here" })).toEqual({
      ok: true,
      output: { uppercaseCount: 0 },
    }));

  it("counts every letter in all-caps text", () =>
    expect(runUppercaseCount({ text: "ABC XYZ" })).toEqual({
      ok: true,
      output: { uppercaseCount: 6 },
    }));

  it("counts accented uppercase letters", () =>
    expect(runUppercaseCount({ text: "ÉÀØ ç" })).toEqual({
      ok: true,
      output: { uppercaseCount: 3 },
    }));

  it("ignores digits and punctuation", () =>
    expect(runUppercaseCount({ text: "AB12!?" })).toEqual({
      ok: true,
      output: { uppercaseCount: 2 },
    }));

  it("counts zero for empty text", () =>
    expect(runUppercaseCount({ text: "" })).toEqual({
      ok: true,
      output: { uppercaseCount: 0 },
    }));

  it("rejects a missing field", () =>
    expect(runUppercaseCount({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runUppercaseCount({ text: 7 }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runUppercaseCount({ text: "A", count: 1 }).ok).toBe(false));

  it("rejects a null input object", () =>
    expect(runUppercaseCount(null).ok).toBe(false));
});
