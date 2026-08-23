import { describe, expect, it } from "vitest";
import { runPangramChecker } from "./tool.js";

describe("Pangram Checker", () => {
  it("calculates the canonical example", () =>
    expect(
      runPangramChecker({
        text: "The quick brown fox jumps over the lazy dog",
      }),
    ).toEqual({
      ok: true,
      output: { isPangram: true },
    }));

  it("rejects text missing at least one letter", () =>
    expect(runPangramChecker({ text: "Hello world" })).toEqual({
      ok: true,
      output: { isPangram: false },
    }));

  it("accepts an uppercase alphabet", () =>
    expect(runPangramChecker({ text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" })).toEqual({
      ok: true,
      output: { isPangram: true },
    }));

  it("accepts mixed-case pangrams with punctuation and digits", () =>
    expect(
      runPangramChecker({
        text: "Sphinx of black quartz, judge my vow!! (42)",
      }),
    ).toEqual({
      ok: true,
      output: { isPangram: true },
    }));

  it("does not treat accented letters as ASCII letters", () =>
    expect(runPangramChecker({ text: "àbcdefghijklmnopqrstuvwxyé" })).toEqual({
      ok: true,
      output: { isPangram: false },
    }));

  it("reports false for empty text", () =>
    expect(runPangramChecker({ text: "" })).toEqual({
      ok: true,
      output: { isPangram: false },
    }));

  it("reports false for digits only", () =>
    expect(runPangramChecker({ text: "1234567890" })).toEqual({
      ok: true,
      output: { isPangram: false },
    }));

  it("rejects a missing field", () =>
    expect(runPangramChecker({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runPangramChecker({ text: true }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runPangramChecker({ text: "a", extra: 1 }).ok).toBe(false));
});
