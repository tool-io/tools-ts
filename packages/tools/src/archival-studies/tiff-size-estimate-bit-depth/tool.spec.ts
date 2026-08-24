import { describe, expect, it } from "vitest";
import {
  calculateTiffSizeEstimateBitDepth,
  runTiffSizeEstimateBitDepth,
  tiffSizeEstimateBitDepthExample,
} from "./tool.js";

describe("archival-studies/tiff-size-estimate-bit-depth", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTiffSizeEstimateBitDepth(tiffSizeEstimateBitDepthExample.input),
    ).toEqual({ ok: true, output: tiffSizeEstimateBitDepthExample.output });
  });

  it("defaults to single-page 8-bit grayscale with no compression", () => {
    expect(
      calculateTiffSizeEstimateBitDepth({ widthPx: 1000, heightPx: 500 }),
    ).toEqual({ sizeBytes: 500000, sizeMiB: 0.476837158203125 });
  });

  it("scales by pages and rejects non-positive dimensions", () => {
    expect(
      calculateTiffSizeEstimateBitDepth({
        widthPx: 100,
        heightPx: 100,
        pages: 4,
      }).sizeBytes,
    ).toBe(40000);
    expect(runTiffSizeEstimateBitDepth({ widthPx: 0, heightPx: 100 }).ok).toBe(
      false,
    );
  });
});
