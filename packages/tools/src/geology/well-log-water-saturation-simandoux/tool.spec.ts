import { describe, expect, it } from "vitest";
import {
  runWellLogWaterSaturationSimandoux,
  wellLogWaterSaturationSimandouxExample,
} from "./tool.js";

describe("well-log-water-saturation-simandoux", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWellLogWaterSaturationSimandoux(
        wellLogWaterSaturationSimandouxExample.input,
      ),
    ).toEqual({
      ok: true,
      output: wellLogWaterSaturationSimandouxExample.output,
    });
  });

  it("falls back to Archie when the shale volume is zero", () => {
    const result = runWellLogWaterSaturationSimandoux({
      trueResistivityOhmM: 20,
      waterResistivityOhmM: 0.05,
      porosity: 0.2,
      shaleResistivityOhmM: 5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.waterSaturation as number).toBeCloseTo(
      0.24999999999999997,
      12,
    );
  });

  it("falls back to Archie without requiring shale resistivity", () => {
    const result = runWellLogWaterSaturationSimandoux({
      porosity: 0.2,
      trueResistivityOhmM: 20,
      waterResistivityOhmM: 0.05,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.waterSaturation as number).toBeCloseTo(0.25, 12);
  });

  it("rejects missing shale resistivity with shale present", () => {
    expect(
      runWellLogWaterSaturationSimandoux({
        trueResistivityOhmM: 10,
        waterResistivityOhmM: 0.05,
        porosity: 0.2,
        shaleVolume: 0.3,
      }).ok,
    ).toBe(false);
  });
});
