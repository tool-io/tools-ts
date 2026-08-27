import { describe, expect, it } from "vitest";
import {
  wellLogGammaRayIndexExample,
  runWellLogGammaRayIndex,
} from "./tool.js";

describe("geology/well-log-gamma-ray-index", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWellLogGammaRayIndex(wellLogGammaRayIndexExample.input)).toEqual({
      ok: true,
      output: wellLogGammaRayIndexExample.output,
    });
  });

  it("returns zero on the clean line and one on the shale line", () => {
    const clean = runWellLogGammaRayIndex({
      gammaRayApi: 20,
      gammaRayCleanApi: 20,
      gammaRayShaleApi: 120,
    });
    const shale = runWellLogGammaRayIndex({
      gammaRayApi: 120,
      gammaRayCleanApi: 20,
      gammaRayShaleApi: 120,
    });
    if (!clean.ok || !shale.ok) throw new Error("expected success");
    expect(clean.output.gammaRayIndex).toBe(0);
    expect(shale.output.gammaRayIndex).toBe(1);
  });

  it("rejects shale baselines not above the clean baseline", () => {
    expect(
      runWellLogGammaRayIndex({
        gammaRayApi: 90,
        gammaRayCleanApi: 120,
        gammaRayShaleApi: 120,
      }).ok,
    ).toBe(false);
  });
});
