import { describe, expect, it } from "vitest";
import {
  gateInducedDrainLeakageExample,
  runGateInducedDrainLeakage,
} from "./tool.js";

const calibrated = {
  characteristicFieldMVPerCm: 400,
  peakFieldMVPerCm: 8,
  prefactorPicoA: 100,
};

describe("GIDL Current Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGateInducedDrainLeakage(gateInducedDrainLeakageExample.input),
    ).toEqual({
      ok: true,
      output: gateInducedDrainLeakageExample.output,
    });
  });

  it("evaluates the supplied calibrated exponential", () => {
    const result = runGateInducedDrainLeakage({
      characteristicFieldMVPerCm: 200,
      peakFieldMVPerCm: 8,
      prefactorPicoA: 50,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.gidlPicoAmperes).toBeCloseTo(50 * Math.exp(-25), 18);
  });

  it("increases with peak drain field at fixed calibration", () => {
    const moderate = runGateInducedDrainLeakage({
      ...calibrated,
      peakFieldMVPerCm: 5,
    });
    const strong = runGateInducedDrainLeakage({
      ...calibrated,
      peakFieldMVPerCm: 6,
    });
    expect(moderate.ok && strong.ok).toBe(true);
    if (moderate.ok && strong.ok)
      expect(strong.output.gidlPicoAmperes).toBeGreaterThan(
        moderate.output.gidlPicoAmperes,
      );
  });

  it("rejects invalid calibration and field inputs", () => {
    for (const input of [
      { ...calibrated, peakFieldMVPerCm: 0 },
      { ...calibrated, characteristicFieldMVPerCm: -1 },
      { ...calibrated, prefactorPicoA: 0 },
      { ...calibrated, peakFieldMVPerCm: Number.NaN },
    ])
      expect(runGateInducedDrainLeakage(input).ok).toBe(false);
  });

  it("requires all three calibrated parameters", () => {
    expect(runGateInducedDrainLeakage({ peakFieldMVPerCm: 8 }).ok).toBe(false);
  });
});
