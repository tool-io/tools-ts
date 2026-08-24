import { describe, expect, it } from "vitest";
import {
  calculateWarcCompressionRatioPercent,
  runWarcCompressionRatioPercent,
  warcCompressionRatioPercentExample,
} from "./tool.js";

describe("archival-studies/warc-compression-ratio-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWarcCompressionRatioPercent(warcCompressionRatioPercentExample.input),
    ).toEqual({ ok: true, output: warcCompressionRatioPercentExample.output });
  });

  it("reports no savings for incompressible archives", () => {
    const result = calculateWarcCompressionRatioPercent({
      uncompressedBytes: 8000,
      compressedBytes: 8000,
    });
    expect(result.compressionRatio).toBe(1);
    expect(result.savingsPercent).toBe(0);
  });

  it("rejects zero-size archives", () => {
    expect(
      runWarcCompressionRatioPercent({
        uncompressedBytes: 0,
        compressedBytes: 0,
      }).ok,
    ).toBe(false);
  });
});
