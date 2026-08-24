import { describe, expect, it } from "vitest";
import {
  calculatePalletLoadedWeightTotal,
  palletLoadedWeightTotalExample,
  runPalletLoadedWeightTotal,
} from "./tool.js";

describe("pallet-loaded-weight-total", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPalletLoadedWeightTotal(palletLoadedWeightTotalExample.input),
    ).toEqual({
      ok: true,
      output: palletLoadedWeightTotalExample.output,
    });
  });

  it("totals a single-carton load with zero tare", () => {
    expect(
      runPalletLoadedWeightTotal({
        palletTareWeightKg: 0,
        cartonCount: 1,
        weightPerCartonKg: 12.5,
      }),
    ).toEqual({
      ok: true,
      output: { cargoNetWeightKg: 12.5, totalGrossWeightKg: 12.5 },
    });
  });
  it("rejects non-positive per-carton weights", () => {
    expect(
      runPalletLoadedWeightTotal({
        palletTareWeightKg: 25,
        cartonCount: 54,
        weightPerCartonKg: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite weights and overflowing loads", () => {
    expect(() =>
      calculatePalletLoadedWeightTotal({
        cartonCount: 1,
        palletTareWeightKg: Number.POSITIVE_INFINITY,
        weightPerCartonKg: 10,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculatePalletLoadedWeightTotal({
        cartonCount: 2,
        palletTareWeightKg: 0,
        weightPerCartonKg: Number.MAX_VALUE,
      }),
    ).toThrow("outside the representable range");
  });
});
