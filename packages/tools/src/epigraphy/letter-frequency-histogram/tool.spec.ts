import { describe, expect, it } from "vitest";
import {
  letterFrequencyHistogramExample,
  runLetterFrequencyHistogram,
} from "./tool.js";

describe("letter-frequency-histogram", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLetterFrequencyHistogram(letterFrequencyHistogramExample.input),
    ).toEqual({
      ok: true,
      output: letterFrequencyHistogramExample.output,
    });
  });

  it("breaks ties by earliest letter and ignores non-letter characters", () => {
    const r = runLetterFrequencyHistogram({ text: "zz!!b a" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.mostCommonLetter as string).toBe("Z");
    expect(r.output.totalLetters as number).toBe(4);
    const accented = runLetterFrequencyHistogram({ text: "Ára" });
    if (!accented.ok) throw new Error("expected success");
    expect(accented.output.mostCommonLetter as string).toBe("A");
    expect(accented.output.totalLetters as number).toBe(3);
  });
  it("rejects texts without letters", () => {
    expect(runLetterFrequencyHistogram({ text: "123 !" }).ok).toBe(false);
  });
});
