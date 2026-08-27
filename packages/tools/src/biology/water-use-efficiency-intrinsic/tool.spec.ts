import { describe, expect, it } from "vitest";
import {
  intrinsicWaterUseEfficiencyExample,
  runIntrinsicWaterUseEfficiency,
} from "./tool.js";

describe("Intrinsic WUE", () => {
  it("publishes an executable example", () =>
    expect(
      runIntrinsicWaterUseEfficiency(intrinsicWaterUseEfficiencyExample.input),
    ).toEqual({
      ok: true,
      output: intrinsicWaterUseEfficiencyExample.output,
    }));
  it("returns zero when photosynthesis stops", () =>
    expect(
      runIntrinsicWaterUseEfficiency({
        netPhotosynthesisUmolM2S: 0,
        stomatalConductanceMolM2S: 0.2,
      }),
    ).toEqual({ ok: true, output: { intrinsicWaterUseEfficiency: 0 } }));
  it("doubles when photosynthesis doubles at fixed conductance", () =>
    expect(
      runIntrinsicWaterUseEfficiency({
        netPhotosynthesisUmolM2S: 30,
        stomatalConductanceMolM2S: 0.25,
      }),
    ).toEqual({ ok: true, output: { intrinsicWaterUseEfficiency: 120 } }));
  it("rises as stomata close", () =>
    expect(
      runIntrinsicWaterUseEfficiency({
        netPhotosynthesisUmolM2S: 15,
        stomatalConductanceMolM2S: 0.125,
      }),
    ).toEqual({ ok: true, output: { intrinsicWaterUseEfficiency: 120 } }));
  it("keeps fractional efficiencies exact", () =>
    expect(
      runIntrinsicWaterUseEfficiency({
        netPhotosynthesisUmolM2S: 10,
        stomatalConductanceMolM2S: 8,
      }),
    ).toEqual({ ok: true, output: { intrinsicWaterUseEfficiency: 1.25 } }));
  it("rejects a zero conductance", () => {
    const result = runIntrinsicWaterUseEfficiency({
      netPhotosynthesisUmolM2S: 15,
      stomatalConductanceMolM2S: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("stomatalConductanceMolM2S");
  });
  it("rejects negative photosynthesis rates", () => {
    const result = runIntrinsicWaterUseEfficiency({
      netPhotosynthesisUmolM2S: -15,
      stomatalConductanceMolM2S: 0.25,
    });
    expect(result.ok).toBe(false);
  });
});
