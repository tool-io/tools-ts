import { describe, expect, it } from "vitest";
import {
  copperplateShadeClassifierExample,
  runCopperplateShadeClassifier,
} from "./tool.js";

describe("copperplate-shade-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCopperplateShadeClassifier(copperplateShadeClassifierExample.input),
    ).toEqual({
      ok: true,
      output: copperplateShadeClassifierExample.output,
    });
  });

  it("calls an even-nib hand monoline", () => {
    const result = runCopperplateShadeClassifier({
      thickStrokeWidthMm: 1.2,
      thinStrokeWidthMm: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.shadingClass).toBe("monoline");
  });

  it("rejects non-positive widths", () => {
    expect(
      runCopperplateShadeClassifier({
        thickStrokeWidthMm: 2,
        thinStrokeWidthMm: 0,
      }).ok,
    ).toBe(false);
    expect(
      runCopperplateShadeClassifier({
        thickStrokeWidthMm: 0.5,
        thinStrokeWidthMm: 1,
      }).ok,
    ).toBe(false);
  });
});
