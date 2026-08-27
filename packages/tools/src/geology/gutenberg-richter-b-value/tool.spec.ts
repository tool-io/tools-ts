import { describe, expect, it } from "vitest";
import {
  gutenbergRichterBValueExample,
  runGutenbergRichterBValue,
} from "./tool.js";

describe("gutenberg-richter-b-value", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGutenbergRichterBValue(gutenbergRichterBValueExample.input),
    ).toEqual({
      ok: true,
      output: gutenbergRichterBValueExample.output,
    });
  });

  it("equals log10(e) for a unit magnitude window", () => {
    const result = runGutenbergRichterBValue({
      meanMagnitude: 3,
      completenessMagnitude: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.bValue as number).toBeCloseTo(Math.LOG10E, 12);
  });
  it("rejects mean at or below completeness", () => {
    expect(
      runGutenbergRichterBValue({ meanMagnitude: 2, completenessMagnitude: 2 })
        .ok,
    ).toBe(false);
  });
});
