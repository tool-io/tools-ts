import { describe, expect, it } from "vitest";
import { runCapitalizeWords } from "./tool.js";

describe("Capitalize Words Tool", () => {
  it("capitalizes each word", () => {
    expect(runCapitalizeWords({ text: "hello world foo" })).toEqual({
      ok: true,
      output: { capitalized: "Hello World Foo" },
    });
  });

  it("does not capitalize after apostrophes", () => {
    expect(runCapitalizeWords({ text: "don't stop" })).toEqual({
      ok: true,
      output: { capitalized: "Don't Stop" },
    });
  });

  it("rejects invalid input", () =>
    expect(runCapitalizeWords(null).ok).toBe(false));
});
