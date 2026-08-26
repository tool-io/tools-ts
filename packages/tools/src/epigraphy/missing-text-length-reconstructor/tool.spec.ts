import { describe, expect, it } from "vitest";
import {
  missingTextLengthReconstructorExample,
  runMissingTextLengthReconstructor,
} from "./tool.js";

describe("missing-text-length-reconstructor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMissingTextLengthReconstructor(
        missingTextLengthReconstructorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: missingTextLengthReconstructorExample.output,
    });
  });

  it("yields zero length for zero lines", () => {
    const result = runMissingTextLengthReconstructor({
      lineCount: 0,
      averageCharactersPerLine: 40,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.reconstructedTextLength as number).toBe(0);
  });

  it("rejects a negative line count", () => {
    expect(
      runMissingTextLengthReconstructor({
        lineCount: -1,
        averageCharactersPerLine: 40,
      }).ok,
    ).toBe(false);
    expect(
      runMissingTextLengthReconstructor({
        lineCount: 1.5,
        averageCharactersPerLine: 40,
      }).ok,
    ).toBe(false);
  });
});
