import { describe, expect, it } from "vitest";
import { runLineEndingNormalizer } from "./tool.js";

describe("Line Ending Normalizer", () => {
  it("normalizes mixed endings to LF by default", () => {
    expect(runLineEndingNormalizer({ text: "a\r\nb\rc\nd" })).toEqual({
      ok: true,
      output: { text: "a\nb\nc\nd" },
    });
  });

  it("normalizes to CRLF", () => {
    expect(
      runLineEndingNormalizer({ ending: "CRLF", text: "a\nb\r\nc\rd" }),
    ).toEqual({
      ok: true,
      output: { text: "a\r\nb\r\nc\r\nd" },
    });
  });

  it("normalizes to CR", () => {
    expect(runLineEndingNormalizer({ ending: "CR", text: "a\r\nb" })).toEqual({
      ok: true,
      output: { text: "a\rb" },
    });
  });

  it("rejects invalid input", () =>
    expect(runLineEndingNormalizer(null).ok).toBe(false));
});
