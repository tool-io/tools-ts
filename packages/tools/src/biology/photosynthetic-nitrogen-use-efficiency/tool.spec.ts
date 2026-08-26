import { describe, expect, it } from "vitest";
import {
  photosyntheticNitrogenUseEfficiencyExample,
  runPhotosyntheticNitrogenUseEfficiency,
} from "./tool.js";

describe("PNUE", () => {
  it("publishes an executable example", () =>
    expect(
      runPhotosyntheticNitrogenUseEfficiency(
        photosyntheticNitrogenUseEfficiencyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: photosyntheticNitrogenUseEfficiencyExample.output,
    }));
  it("returns zero when photosynthesis stops", () =>
    expect(
      runPhotosyntheticNitrogenUseEfficiency({
        leafNitrogenGM2: 1.5,
        netPhotosynthesisUmolM2S: 0,
      }),
    ).toEqual({
      ok: true,
      output: { photosyntheticNitrogenUseEfficiency: 0 },
    }));
  it("doubles when photosynthesis doubles at fixed nitrogen", () =>
    expect(
      runPhotosyntheticNitrogenUseEfficiency({
        leafNitrogenGM2: 1.2,
        netPhotosynthesisUmolM2S: 36,
      }),
    ).toEqual({
      ok: true,
      output: { photosyntheticNitrogenUseEfficiency: 30 },
    }));
  it("falls as leaf nitrogen accumulates", () =>
    expect(
      runPhotosyntheticNitrogenUseEfficiency({
        leafNitrogenGM2: 2.4,
        netPhotosynthesisUmolM2S: 18,
      }),
    ).toEqual({
      ok: true,
      output: { photosyntheticNitrogenUseEfficiency: 7.5 },
    }));
  it("keeps fractional efficiencies exact", () =>
    expect(
      runPhotosyntheticNitrogenUseEfficiency({
        leafNitrogenGM2: 8,
        netPhotosynthesisUmolM2S: 10,
      }),
    ).toEqual({
      ok: true,
      output: { photosyntheticNitrogenUseEfficiency: 1.25 },
    }));
  it("rejects a zero leaf nitrogen area density", () => {
    const result = runPhotosyntheticNitrogenUseEfficiency({
      leafNitrogenGM2: 0,
      netPhotosynthesisUmolM2S: 18,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("leafNitrogenGM2");
  });
  it("rejects negative photosynthesis rates", () => {
    const result = runPhotosyntheticNitrogenUseEfficiency({
      leafNitrogenGM2: 1.2,
      netPhotosynthesisUmolM2S: -1,
    });
    expect(result.ok).toBe(false);
  });
});
