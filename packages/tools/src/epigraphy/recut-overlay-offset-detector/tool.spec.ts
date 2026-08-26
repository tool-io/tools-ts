import { describe, expect, it } from "vitest";
import {
  recutOverlayOffsetDetectorExample,
  runRecutOverlayOffsetDetector,
} from "./tool.js";

describe("recut-overlay-offset-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRecutOverlayOffsetDetector(recutOverlayOffsetDetectorExample.input),
    ).toEqual({
      ok: true,
      output: recutOverlayOffsetDetectorExample.output,
    });
  });

  it("reports zero offset and east direction for a perfect overlay", () => {
    const result = runRecutOverlayOffsetDetector({
      offsetXmm: 0,
      offsetYmm: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.offsetMm as number).toBe(0);
    expect(result.output.directionDeg as number).toBe(0);
  });

  it("reports due north as 90 degrees", () => {
    const result = runRecutOverlayOffsetDetector({
      offsetXmm: 0,
      offsetYmm: 5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.offsetMm as number).toBe(5);
    expect(result.output.directionDeg as number).toBe(90);
  });

  it("rejects a non-finite offset", () => {
    expect(
      runRecutOverlayOffsetDetector({
        offsetXmm: Number.POSITIVE_INFINITY,
        offsetYmm: 0,
      }).ok,
    ).toBe(false);
  });
});
