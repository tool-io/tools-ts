import { describe, expect, it } from "vitest";
import { runIsogramChecker } from "./tool.js";

describe("Isogram Checker", () => {
  it("calculates the canonical example", () =>
    expect(runIsogramChecker({ text: "dialogue" })).toEqual({
      ok: true,
      output: { isIsogram: true },
    }));

  it("detects repeated letters", () =>
    expect(runIsogramChecker({ text: "letter" })).toEqual({
      ok: true,
      output: { isIsogram: false },
    }));

  it("ignores case when comparing letters", () =>
    expect(runIsogramChecker({ text: "Alpha" })).toEqual({
      ok: true,
      output: { isIsogram: false },
    }));

  it("ignores non-letter characters", () =>
    expect(runIsogramChecker({ text: "six-year-old 123!" })).toEqual({
      ok: true,
      output: { isIsogram: true },
    }));

  it("treats repeated separators as harmless", () =>
    expect(runIsogramChecker({ text: "-.- ... ---" })).toEqual({
      ok: true,
      output: { isIsogram: true },
    }));

  it("does not treat accented letters as ASCII letter repeats", () =>
    expect(runIsogramChecker({ text: "café" })).toEqual({
      ok: true,
      output: { isIsogram: true },
    }));

  it("reports true for empty text", () =>
    expect(runIsogramChecker({ text: "" })).toEqual({
      ok: true,
      output: { isIsogram: true },
    }));

  it("rejects a missing field", () =>
    expect(runIsogramChecker({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runIsogramChecker({ text: 42 }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runIsogramChecker({ text: "a", extra: 1 }).ok).toBe(false));
});
