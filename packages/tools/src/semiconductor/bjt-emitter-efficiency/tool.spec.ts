import { describe, expect, it } from "vitest";
import { emitterEfficiencyExample, runEmitterEfficiency } from "./tool.js";

describe("bjt emitter efficiency calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEmitterEfficiency(emitterEfficiencyExample.input)).toEqual({
      ok: true,
      output: emitterEfficiencyExample.output,
    });
  });

  it("improves with heavier emitter doping", () => {
    const light = runEmitterEfficiency({
      baseDopingPerCm3: 1e16, baseWidthUm: 0.5,
      emitterDiffusionLengthUm: 2, emitterDopingPerCm3: 1e17,
    });
    const heavy = runEmitterEfficiency({
      baseDopingPerCm3: 1e16, baseWidthUm: 0.5,
      emitterDiffusionLengthUm: 2, emitterDopingPerCm3: 1e19,
    });
    if (!light.ok || !heavy.ok) throw new Error("expected success");
    const lightGamma = (light.output as { gamma: number }).gamma;
    const heavyGamma = (heavy.output as { gamma: number }).gamma;
    expect(heavyGamma).toBeGreaterThan(lightGamma);
  });

  it("rejects non-positive inputs through execution", () => {
    expect(runEmitterEfficiency({
      baseDopingPerCm3: 0, baseWidthUm: 0.5,
      emitterDiffusionLengthUm: 2, emitterDopingPerCm3: 1e19,
    }).ok).toBe(false);
  });
});
