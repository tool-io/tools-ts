import { describe, expect, it } from "vitest";
import {
  materialBalanceOilInitiallyInPlaceExample,
  runMaterialBalanceOilInitiallyInPlace,
} from "./tool.js";

describe("material-balance-oil-initially-in-place", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMaterialBalanceOilInitiallyInPlace(
        materialBalanceOilInitiallyInPlaceExample.input,
      ),
    ).toEqual({
      ok: true,
      output: materialBalanceOilInitiallyInPlaceExample.output,
    });
  });

  it("scales linearly with area", () => {
    const doubled = runMaterialBalanceOilInitiallyInPlace({
      areaSquareKilometers: 20,
      netThicknessM: 20,
      porosity: 0.2,
      waterSaturation: 0.3,
      oilFormationVolumeFactor: 1.2,
    });
    if (!doubled.ok) throw new Error("expected success");
    expect(doubled.output.oilInitiallyInPlaceM3 as number).toBeCloseTo(
      46666666.666666664,
      6,
    );
  });

  it("rejects full water saturation", () => {
    expect(
      runMaterialBalanceOilInitiallyInPlace({
        areaSquareKilometers: 10,
        netThicknessM: 20,
        porosity: 0.2,
        waterSaturation: 1,
        oilFormationVolumeFactor: 1.2,
      }).ok,
    ).toBe(false);
  });
});
