import { describe, expect, it } from "vitest";
import {
  relativePermeabilityOilWaterExample,
  runRelativePermeabilityOilWater,
} from "./tool.js";

describe("relative-permeability-oil-water", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRelativePermeabilityOilWater(
        relativePermeabilityOilWaterExample.input,
      ),
    ).toEqual({
      ok: true,
      output: relativePermeabilityOilWaterExample.output,
    });
  });

  it("returns one for each phase at its mobility extreme", () => {
    const waterEnd = runRelativePermeabilityOilWater({
      waterSaturation: 0.85,
      residualWaterSaturation: 0.2,
      residualOilSaturation: 0.15,
    });
    const oilEnd = runRelativePermeabilityOilWater({
      waterSaturation: 0.2,
      residualWaterSaturation: 0.2,
      residualOilSaturation: 0.15,
    });
    if (!waterEnd.ok || !oilEnd.ok) throw new Error("expected success");
    expect(waterEnd.output.waterRelativePermeability as number).toBeCloseTo(
      1,
      12,
    );
    expect(oilEnd.output.oilRelativePermeability as number).toBeCloseTo(1, 12);
  });

  it("rejects saturations outside the mobile range", () => {
    expect(
      runRelativePermeabilityOilWater({
        waterSaturation: 0.95,
        residualOilSaturation: 0.15,
      }).ok,
    ).toBe(false);
  });
});
