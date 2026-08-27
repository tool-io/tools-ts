import { describe, expect, it } from "vitest";
import { runWellLogShaleVolume, wellLogShaleVolumeExample } from "./tool.js";

describe("well-log-shale-volume", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWellLogShaleVolume(wellLogShaleVolumeExample.input)).toEqual({
      ok: true,
      output: wellLogShaleVolumeExample.output,
    });
  });

  it("returns one at the shale point and zero at the sand point", () => {
    const shale = runWellLogShaleVolume({
      gammaRayApi: 125,
      cleanSandGammaRayApi: 25,
      shaleGammaRayApi: 125,
    });
    const sand = runWellLogShaleVolume({
      gammaRayApi: 25,
      cleanSandGammaRayApi: 25,
      shaleGammaRayApi: 125,
    });
    if (!shale.ok || !sand.ok) throw new Error("expected success");
    expect(shale.output.shaleVolume as number).toBeGreaterThan(0.99);
    expect(sand.output.shaleVolume as number).toBe(0);
  });

  it("rejects readings outside the end members", () => {
    expect(
      runWellLogShaleVolume({
        gammaRayApi: 200,
        cleanSandGammaRayApi: 25,
        shaleGammaRayApi: 125,
      }).ok,
    ).toBe(false);
  });
});
