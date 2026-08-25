import { describe, expect, it } from "vitest";
import {
  fuelPricePerMileBurnExample,
  runFuelPricePerMileBurn,
} from "./tool.js";

describe("fuel-price-per-mile-burn", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFuelPricePerMileBurn(fuelPricePerMileBurnExample.input)).toEqual({
      ok: true,
      output: fuelPricePerMileBurnExample.output,
    });
  });

  it("scales linearly with price", () => {
    expect(
      runFuelPricePerMileBurn({ dieselPriceUsdPerGallon: 4.0, truckMpg: 8 }),
    ).toEqual({ ok: true, output: { fuelCostPerMileUsd: 0.5 } });
  });

  it("rejects zero MPG", () => {
    expect(
      runFuelPricePerMileBurn({ dieselPriceUsdPerGallon: 3.5, truckMpg: 0 }).ok,
    ).toBe(false);
  });
});
