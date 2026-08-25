import { describe, expect, it } from "vitest";
import { runCaselayerDepthMoistureCalculator } from "./tool.js";
describe("Casing Moisture Calc", () => {
  it("calculates with the default field capacity", () =>
    expect(
      runCaselayerDepthMoistureCalculator({
        casingDepthMm: 50,
        trayAreaCm2: 1000,
      }),
    ).toEqual({ ok: true, output: { casingWaterMl: 3500 } }));
  it("accepts full saturation", () =>
    expect(
      runCaselayerDepthMoistureCalculator({
        casingDepthMm: 50,
        fieldCapacityFraction: 1,
        trayAreaCm2: 1000,
      }),
    ).toEqual({ ok: true, output: { casingWaterMl: 5000 } }));
  it("yields no water at zero field capacity", () =>
    expect(
      runCaselayerDepthMoistureCalculator({
        casingDepthMm: 50,
        fieldCapacityFraction: 0,
        trayAreaCm2: 1000,
      }),
    ).toEqual({ ok: true, output: { casingWaterMl: 0 } }));
  it("handles small trays", () =>
    expect(
      runCaselayerDepthMoistureCalculator({
        casingDepthMm: 10,
        fieldCapacityFraction: 0.5,
        trayAreaCm2: 200,
      }),
    ).toEqual({ ok: true, output: { casingWaterMl: 100 } }));
  it("handles fractional depths", () =>
    expect(
      runCaselayerDepthMoistureCalculator({
        casingDepthMm: 25.5,
        trayAreaCm2: 400,
      }),
    ).toEqual({ ok: true, output: { casingWaterMl: 714 } }));
  it("rejects zero depth", () =>
    expect(
      runCaselayerDepthMoistureCalculator({
        casingDepthMm: 0,
        trayAreaCm2: 100,
      }).ok,
    ).toBe(false));
  it("rejects negative area", () =>
    expect(
      runCaselayerDepthMoistureCalculator({
        casingDepthMm: 10,
        trayAreaCm2: -1,
      }).ok,
    ).toBe(false));
  it("rejects field capacity above one", () =>
    expect(
      runCaselayerDepthMoistureCalculator({
        casingDepthMm: 10,
        fieldCapacityFraction: 1.5,
        trayAreaCm2: 100,
      }).ok,
    ).toBe(false));
  it("rejects negative field capacity", () =>
    expect(
      runCaselayerDepthMoistureCalculator({
        casingDepthMm: 10,
        fieldCapacityFraction: -0.1,
        trayAreaCm2: 100,
      }).ok,
    ).toBe(false));
});
