import { describe, expect, it } from "vitest";
import {
  italicSlantDegreeRaterExample,
  runItalicSlantDegreeRater,
} from "./tool.js";

describe("italic-slant-degree-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runItalicSlantDegreeRater(italicSlantDegreeRaterExample.input),
    ).toEqual({
      ok: true,
      output: italicSlantDegreeRaterExample.output,
    });
  });

  it("rates an upright hand below six degrees", () => {
    const result = runItalicSlantDegreeRater({ slantDegrees: 3.5 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rating).toBe("upright");
  });

  it("rejects out-of-range slants", () => {
    expect(runItalicSlantDegreeRater({ slantDegrees: 60 }).ok).toBe(false);
    expect(runItalicSlantDegreeRater({ slantDegrees: -4 }).ok).toBe(false);
  });
});
