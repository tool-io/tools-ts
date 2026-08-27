import { describe, expect, it } from "vitest";
import {
  calculateInductorSaturationMarginCheck,
  inductorSaturationMarginCheckExample,
  runInductorSaturationMarginCheck,
} from "./tool.js";

describe("inductor saturation margin check", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runInductorSaturationMarginCheck(
        inductorSaturationMarginCheckExample.input,
      ),
    ).toEqual({
      ok: true,
      output: inductorSaturationMarginCheckExample.output,
    });
  });

  it("reports zero margin at the saturation limit", () => {
    expect(
      calculateInductorSaturationMarginCheck({
        peakOperatingAmps: 2,
        saturationCurrentAmps: 2,
      }).saturationMarginPercent,
    ).toBeCloseTo(0, 15);
  });

  it("reports negative margin when saturation is exceeded", () => {
    const result = calculateInductorSaturationMarginCheck({
      peakOperatingAmps: 3,
      saturationCurrentAmps: 2.4,
    });
    expect(result.saturationMarginPercent).toBeCloseTo(-20, 12);
    expect(result.saturationMarginPercent).toBeLessThan(0);
  });

  it("matches the ratio definition for arbitrary currents", () => {
    const result = calculateInductorSaturationMarginCheck({
      peakOperatingAmps: 1.7,
      saturationCurrentAmps: 4.2,
    });
    expect(result.saturationMarginPercent).toBeCloseTo(
      (4.2 / 1.7 - 1) * 100,
      15,
    );
  });

  it("rejects non-positive currents through execution", () => {
    expect(
      runInductorSaturationMarginCheck({
        peakOperatingAmps: 1,
        saturationCurrentAmps: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "saturationCurrentAmps" }],
      },
      ok: false,
    });
    expect(
      runInductorSaturationMarginCheck({
        peakOperatingAmps: -1,
        saturationCurrentAmps: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "peakOperatingAmps" }],
      },
      ok: false,
    });
  });

  it("keeps margins positive for conservative designs", () => {
    expect(
      calculateInductorSaturationMarginCheck({
        peakOperatingAmps: 1,
        saturationCurrentAmps: 6,
      }).saturationMarginPercent,
    ).toBe(500);
  });
});
