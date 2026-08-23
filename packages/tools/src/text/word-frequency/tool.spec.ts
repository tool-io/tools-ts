import { describe, expect, it } from "vitest";
import {
  wordFrequencyExample,
  calculateWordFrequency,
  runWordFrequency,
} from "./tool.js";

describe("text/word-frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWordFrequency(wordFrequencyExample.input)).toEqual({
      ok: true,
      output: wordFrequencyExample.output,
    });
  });
  it("rejects invalid input (empty_text)", () => {
    expect(runWordFrequency({ text: "!!! ???" }).ok).toBe(false);
  });
});
