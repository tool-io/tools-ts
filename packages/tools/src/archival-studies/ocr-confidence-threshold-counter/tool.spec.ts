import { describe, expect, it } from "vitest";
import {
  calculateOcrConfidenceThresholdCounter,
  ocrConfidenceThresholdCounterExample,
  runOcrConfidenceThresholdCounter,
} from "./tool.js";

describe("archival-studies/ocr-confidence-threshold-counter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOcrConfidenceThresholdCounter(
        ocrConfidenceThresholdCounterExample.input,
      ),
    ).toEqual({
      ok: true,
      output: ocrConfidenceThresholdCounterExample.output,
    });
  });

  it("counts nothing below a zero threshold", () => {
    const result = calculateOcrConfidenceThresholdCounter({
      confidences: [0.2, 0.5],
      threshold: 0,
    });
    expect(result.belowCount).toBe(0);
    expect(result.fractionBelow).toBe(0);
  });

  it("rejects out-of-range confidence scores", () => {
    expect(
      runOcrConfidenceThresholdCounter({
        confidences: [0.9, 1.2],
      }).ok,
    ).toBe(false);
    expect(
      runOcrConfidenceThresholdCounter({
        confidences: [0.5],
        threshold: 1.1,
      }).ok,
    ).toBe(false);
  });
});
