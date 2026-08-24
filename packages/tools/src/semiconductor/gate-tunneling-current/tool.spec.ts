import { describe, expect, it } from "vitest";
import {
  gateTunnelingCurrentExample,
  runGateTunnelingCurrent,
} from "./tool.js";

const calibrated = {
  attenuationPerNm: 3,
  oxideThicknessNm: 2,
  prefactorPicoAPerUm2: 1_000,
};

describe("Gate Tunneling Current Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGateTunnelingCurrent(gateTunnelingCurrentExample.input)).toEqual({
      ok: true,
      output: gateTunnelingCurrentExample.output,
    });
  });

  it("evaluates the supplied calibrated exponential", () => {
    const result = runGateTunnelingCurrent({
      attenuationPerNm: 2,
      oxideThicknessNm: 1.5,
      prefactorPicoAPerUm2: 500,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.gateLeakagePAperUm2).toBeCloseTo(
        500 * Math.exp(-3),
        12,
      );
  });

  it("decays exponentially with oxide thickness", () => {
    const thin = runGateTunnelingCurrent({
      ...calibrated,
      oxideThicknessNm: 1,
    });
    const thick = runGateTunnelingCurrent(calibrated);
    expect(thin.ok && thick.ok).toBe(true);
    if (thin.ok && thick.ok)
      expect(thick.output.gateLeakagePAperUm2).toBeCloseTo(
        thin.output.gateLeakagePAperUm2 * Math.exp(-3),
        12,
      );
  });

  it("rejects invalid thickness and calibration inputs", () => {
    for (const input of [
      { ...calibrated, oxideThicknessNm: 0 },
      { ...calibrated, attenuationPerNm: -3 },
      { ...calibrated, prefactorPicoAPerUm2: 0 },
      { ...calibrated, oxideThicknessNm: Number.POSITIVE_INFINITY },
    ])
      expect(runGateTunnelingCurrent(input).ok).toBe(false);
  });

  it("requires thickness, attenuation, and prefactor", () => {
    expect(runGateTunnelingCurrent({ oxideThicknessNm: 2 }).ok).toBe(false);
  });
});
