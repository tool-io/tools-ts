import { describe, expect, it } from "vitest";
import { compressionIndexExample, runCompressionIndex } from "./tool.js";

describe("compression-index", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCompressionIndex(compressionIndexExample.input)).toEqual({
      ok: true,
      output: compressionIndexExample.output,
    });
  });

  it("computes a representative oedometer increment", () => {
    const result = runCompressionIndex({
      voidRatioStart: 0.9,
      voidRatioEnd: 0.7,
      effectiveStressStartKpa: 100,
      effectiveStressEndKpa: 400,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.compressionIndex as number).toBe(0.33219280948873636);
  });

  it("rejects a decreasing stress path", () => {
    expect(
      runCompressionIndex({
        voidRatioStart: 1.0,
        voidRatioEnd: 0.9,
        effectiveStressStartKpa: 200,
        effectiveStressEndKpa: 100,
      }).ok,
    ).toBe(false);
  });
});
