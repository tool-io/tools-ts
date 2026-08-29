import { describe, expect, it } from "vitest";
import {
  sesamGuide,
  sesamGuideExample as example,
  runSesamGuide,
} from "./tool.js";

describe("SESAM selection checks", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runSesamGuide(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));

  it("reports insufficient saturation and an exceeded threshold", () => {
    const result = sesamGuide({
      modulationDepthPercent: 1,
      nonsaturableLossPercent: 1.5,
      saturationFluenceUJPerCm2: 100,
      intracavityFluenceUJPerCm2: 50,
      damageThresholdUJPerCm2: 40,
    });
    expect(result.reachesSaturationFluence).toBe(false);
    expect(result.belowDamageThreshold).toBe(false);
    expect(result.lossMarginPercent).toBe(-0.5);
  });

  it("rejects non-positive datasheet fluences", () =>
    expect(
      runSesamGuide({
        modulationDepthPercent: 1,
        nonsaturableLossPercent: 0.2,
        saturationFluenceUJPerCm2: 0,
        intracavityFluenceUJPerCm2: 10,
        damageThresholdUJPerCm2: 100,
      }).ok,
    ).toBe(false));
});
