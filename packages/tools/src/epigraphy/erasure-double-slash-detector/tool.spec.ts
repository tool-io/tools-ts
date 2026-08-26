import { describe, expect, it } from "vitest";
import {
  calculateErasureDoubleSlashDetector,
  erasureDoubleSlashDetectorExample,
  runErasureDoubleSlashDetector,
} from "./tool.js";

describe("epigraphy/erasure-double-slash-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runErasureDoubleSlashDetector(erasureDoubleSlashDetectorExample.input),
    ).toEqual({ ok: true, output: erasureDoubleSlashDetectorExample.output });
  });

  it("measures longer runs and ignores single slashes", () => {
    expect(
      calculateErasureDoubleSlashDetector({ text: "x /// y / z" }),
    ).toEqual({
      erasureMarkCount: 1,
      positions: [2],
      longestRun: 3,
    });
  });

  it("detects backward slashes too", () => {
    expect(
      calculateErasureDoubleSlashDetector({ text: "ab\\\\cd" })
        .erasureMarkCount,
    ).toBe(1);
  });

  it("rejects empty input", () => {
    expect(runErasureDoubleSlashDetector({ text: "" }).ok).toBe(false);
  });
});
