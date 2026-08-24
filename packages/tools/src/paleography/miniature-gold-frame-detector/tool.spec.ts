import { describe, expect, it } from "vitest";
import {
  miniatureGoldFrameDetectorExample,
  runMiniatureGoldFrameDetector,
} from "./tool.js";

describe("miniature-gold-frame-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMiniatureGoldFrameDetector(miniatureGoldFrameDetectorExample.input),
    ).toEqual({
      ok: true,
      output: miniatureGoldFrameDetectorExample.output,
    });
  });

  it("downgrades thin four-sided gold as unconfirmed", () => {
    const result = runMiniatureGoldFrameDetector({
      gildedSideCount: 4,
      meanGoldBorderWidthMm: 0.8,
      minimumFrameWidthMm: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.frameClass).toBe("full_gold_frame");
    expect(result.output.confirmedFullFrame).toBe(false);
  });

  it("rejects more than four gilded sides", () => {
    expect(
      runMiniatureGoldFrameDetector({
        gildedSideCount: 5,
        meanGoldBorderWidthMm: 3,
      }).ok,
    ).toBe(false);
  });
});
