import { describe, expect, it } from "vitest";
import {
  runWatermarkTwinMatchFinder,
  watermarkTwinMatchFinderExample,
} from "./tool.js";

describe("watermark-twin-match-finder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWatermarkTwinMatchFinder(watermarkTwinMatchFinderExample.input),
    ).toEqual({ ok: true, output: watermarkTwinMatchFinderExample.output });
  });

  it("rejects a distant stock outside tolerance", () => {
    const result = runWatermarkTwinMatchFinder({
      chainSpacingOneMm: 27,
      laidSpacingOneMm: 2.4,
      chainSpacingTwoMm: 33,
      laidSpacingTwoMm: 2.4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.isProbableTwin as boolean).toBe(false);
  });

  it("rejects non-positive spacings", () => {
    expect(
      runWatermarkTwinMatchFinder({
        chainSpacingOneMm: 0,
        laidSpacingOneMm: 2,
        chainSpacingTwoMm: 27,
        laidSpacingTwoMm: 2,
      }).ok,
    ).toBe(false);
  });
});
