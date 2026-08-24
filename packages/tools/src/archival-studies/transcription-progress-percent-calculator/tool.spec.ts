import { describe, expect, it } from "vitest";
import {
  calculateTranscriptionProgressPercentCalculator,
  runTranscriptionProgressPercentCalculator,
  transcriptionProgressPercentCalculatorExample,
} from "./tool.js";

describe("archival-studies/transcription-progress-percent-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTranscriptionProgressPercentCalculator(
        transcriptionProgressPercentCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: transcriptionProgressPercentCalculatorExample.output,
    });
  });

  it("reports full completion when all characters are done", () => {
    const result = calculateTranscriptionProgressPercentCalculator({
      transcribedCharacters: 500,
      totalCharacters: 500,
    });
    expect(result.percentComplete).toBe(100);
    expect(result.remainingCharacters).toBe(0);
  });

  it("rejects transcribed counts above the total", () => {
    expect(
      runTranscriptionProgressPercentCalculator({
        transcribedCharacters: 300,
        totalCharacters: 200,
      }).ok,
    ).toBe(false);
  });
});
