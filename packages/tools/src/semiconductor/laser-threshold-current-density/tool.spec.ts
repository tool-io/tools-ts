import { describe, expect, it } from "vitest";
import {
  laserThresholdCurrentDensityExample,
  runLaserThresholdCurrentDensity,
} from "./tool.js";

describe("laser threshold current density calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLaserThresholdCurrentDensity(
        laserThresholdCurrentDensityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: laserThresholdCurrentDensityExample.output,
    });
  });

  it("matches the elementary charge product for a thick highly pumped well", () => {
    const result = runLaserThresholdCurrentDensity({
      activeThicknessUm: 0.1,
      recombinationRatePerCm3PerS: 1e33,
    });
    expect(result).toEqual({
      ok: true,
      output: { thresholdCurrentDensityKAPerCm2: 1602176.634 },
    });
  });

  it("scales linearly with active thickness", () => {
    const one = runLaserThresholdCurrentDensity({
      activeThicknessUm: 0.2,
      recombinationRatePerCm3PerS: 1e24,
    });
    const two = runLaserThresholdCurrentDensity({
      activeThicknessUm: 0.4,
      recombinationRatePerCm3PerS: 1e24,
    });
    if (!one.ok || !two.ok) throw new Error("expected success");
    expect(two.output.thresholdCurrentDensityKAPerCm2 as number).toBe(
      2 * (one.output.thresholdCurrentDensityKAPerCm2 as number),
    );
  });

  it("scales linearly with recombination rate", () => {
    const one = runLaserThresholdCurrentDensity({
      activeThicknessUm: 0.5,
      recombinationRatePerCm3PerS: 1e23,
    });
    const two = runLaserThresholdCurrentDensity({
      activeThicknessUm: 0.5,
      recombinationRatePerCm3PerS: 1e25,
    });
    if (!one.ok || !two.ok) throw new Error("expected success");
    expect(
      (two.output.thresholdCurrentDensityKAPerCm2 as number) /
        (one.output.thresholdCurrentDensityKAPerCm2 as number),
    ).toBe(100);
  });

  it("converts micrometers to centimeters exactly", () => {
    const result = runLaserThresholdCurrentDensity({
      activeThicknessUm: 1,
      recombinationRatePerCm3PerS: 1e22,
    });
    expect(result).toEqual({
      ok: true,
      output: { thresholdCurrentDensityKAPerCm2: 0.0001602176634 },
    });
  });

  it("rejects non-positive thickness", () => {
    for (const thickness of [0, -0.5])
      expect(
        runLaserThresholdCurrentDensity({
          activeThicknessUm: thickness,
          recombinationRatePerCm3PerS: 1e24,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
  });

  it("rejects non-positive recombination rate", () => {
    for (const rate of [0, -1e24])
      expect(
        runLaserThresholdCurrentDensity({
          activeThicknessUm: 0.5,
          recombinationRatePerCm3PerS: rate,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
  });

  it("rejects missing and non-finite inputs", () => {
    expect(
      runLaserThresholdCurrentDensity({ activeThicknessUm: 0.5 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runLaserThresholdCurrentDensity({
        activeThicknessUm: Number.NaN,
        recombinationRatePerCm3PerS: 1e24,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });
});
