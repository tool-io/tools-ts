import { describe, expect, it } from "vitest";
import {
  runWellLogWaterSaturationArchie,
  wellLogWaterSaturationArchieExample,
} from "./tool.js";

describe("well-log-water-saturation-archie", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWellLogWaterSaturationArchie(
        wellLogWaterSaturationArchieExample.input,
      ),
    ).toEqual({
      ok: true,
      output: wellLogWaterSaturationArchieExample.output,
    });
  });

  it("returns one when Rt equals the wet resistivity", () => {
    const result = runWellLogWaterSaturationArchie({
      trueResistivityOhmM: 1.25,
      waterResistivityOhmM: 0.05,
      porosity: 0.2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.waterSaturation as number).toBeCloseTo(1, 12);
  });

  it("rejects non-positive porosity", () => {
    expect(
      runWellLogWaterSaturationArchie({
        trueResistivityOhmM: 20,
        waterResistivityOhmM: 0.05,
        porosity: 0,
      }).ok,
    ).toBe(false);
  });
});
