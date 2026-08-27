import { describe, expect, it } from "vitest";
import { recompressionIndexExample, runRecompressionIndex } from "./tool.js";

describe("recompression-index", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRecompressionIndex(recompressionIndexExample.input)).toEqual({
      ok: true,
      output: recompressionIndexExample.output,
    });
  });

  it("computes a representative unload-reload loop", () => {
    const result = runRecompressionIndex({
      voidRatioStart: 0.75,
      voidRatioEnd: 0.72,
      effectiveStressStartKpa: 200,
      effectiveStressEndKpa: 800,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.recompressionIndex as number).toBe(
      0.04982892142331048,
    );
  });

  it("rejects a negative stress", () => {
    expect(
      runRecompressionIndex({
        voidRatioStart: 0.75,
        voidRatioEnd: 0.72,
        effectiveStressStartKpa: -1,
        effectiveStressEndKpa: 800,
      }).ok,
    ).toBe(false);
  });
});
