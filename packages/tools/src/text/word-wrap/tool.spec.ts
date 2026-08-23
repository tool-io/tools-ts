import { describe, expect, it } from "vitest";
import { wordWrapExample, calculateWordWrap, runWordWrap } from "./tool.js";

describe("text/word-wrap", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWordWrap(wordWrapExample.input)).toEqual({
      ok: true,
      output: wordWrapExample.output,
    });
  });
  it("rejects invalid input (invalid_field)", () => {
    expect(runWordWrap({ text: "a b", width: 0 }).ok).toBe(false);
  });
  it("keeps oversized words on their own lines", () => {
    const result = runWordWrap({ text: "short extraordinary tiny", width: 6 });
    expect(
      result.ok && result.output.wrappedText === "short\nextraordinary\ntiny",
    ).toBe(true);
  });
});
