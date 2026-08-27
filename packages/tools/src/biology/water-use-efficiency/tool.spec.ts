import { describe, expect, it } from "vitest";
import { waterUseEfficiencyExample, runWaterUseEfficiency } from "./tool.js";

describe("WUE Calculator", () => {
  it("matches the canonical example", () => {
    expect(runWaterUseEfficiency(waterUseEfficiencyExample.input)).toEqual({
      ok: true,
      output: waterUseEfficiencyExample.output,
    });
  });

  it("reports zero efficiency without carbon gain", () => {
    expect(
      runWaterUseEfficiency({
        netPhotosynthesisUmolPerM2S: 0,
        transpirationMmolPerM2S: 10,
      }),
    ).toEqual({ ok: true, output: { waterUseEfficiency: 0 } });
  });

  it("ranks drought adapted leaves above profligate ones", () => {
    expect(
      runWaterUseEfficiency({
        netPhotosynthesisUmolPerM2S: 18,
        transpirationMmolPerM2S: 2,
      }),
    ).toEqual({ ok: true, output: { waterUseEfficiency: 9 } });
    expect(
      runWaterUseEfficiency({
        netPhotosynthesisUmolPerM2S: 15,
        transpirationMmolPerM2S: 6,
      }),
    ).toEqual({ ok: true, output: { waterUseEfficiency: 2.5 } });
  });

  it("accepts fractional fluxes", () => {
    expect(
      runWaterUseEfficiency({
        netPhotosynthesisUmolPerM2S: 7.5,
        transpirationMmolPerM2S: 1.25,
      }),
    ).toEqual({ ok: true, output: { waterUseEfficiency: 6 } });
  });

  it("rejects zero transpiration with a stable field", () => {
    const result = runWaterUseEfficiency({
      netPhotosynthesisUmolPerM2S: 20,
      transpirationMmolPerM2S: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "transpirationMmolPerM2S",
      });
  });

  it("rejects negative photosynthesis through the schema", () => {
    expect(
      runWaterUseEfficiency({
        netPhotosynthesisUmolPerM2S: -5,
        transpirationMmolPerM2S: 4,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative and non finite transpiration through the schema and guard", () => {
    expect(
      runWaterUseEfficiency({
        netPhotosynthesisUmolPerM2S: 20,
        transpirationMmolPerM2S: -4,
      }).ok,
    ).toBe(false);
    expect(
      runWaterUseEfficiency({
        netPhotosynthesisUmolPerM2S: 20,
        transpirationMmolPerM2S: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });
});
