import { describe, expect, it } from "vitest";
import {
  copticModuleRatioClassifierExample,
  runCopticModuleRatioClassifier,
} from "./tool.js";

describe("coptic-module-ratio-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCopticModuleRatioClassifier(copticModuleRatioClassifierExample.input),
    ).toEqual({ ok: true, output: copticModuleRatioClassifierExample.output });
  });

  it("classifies a broad module above the supplied bound", () => {
    const result = runCopticModuleRatioClassifier({
      nibWidthMm: 0.4,
      letterHeightMm: 3.2,
      fineModuleMaximum: 5,
      broadModuleMinimum: 7,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.moduleRatio as number).toBe(8);
    expect(result.output.moduleClass as string).toBe("broad_module");
  });

  it("rejects inverted thresholds", () => {
    expect(
      runCopticModuleRatioClassifier({
        nibWidthMm: 1,
        letterHeightMm: 5,
        fineModuleMaximum: 7,
        broadModuleMinimum: 5,
      }).ok,
    ).toBe(false);
  });
});
