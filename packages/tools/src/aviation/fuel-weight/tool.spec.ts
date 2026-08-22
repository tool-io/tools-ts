import { describe, expect, it } from "vitest";
import { calculateFuelWeight, runFuelWeight } from "./tool.js";

describe("fuel weight calculator", () => {
  it("uses six pounds per gallon by default", () => {
    expect(runFuelWeight({ fuelGallons: 20 })).toEqual({
      ok: true,
      output: { weightLb: 120 },
    });
  });
  it("supports custom densities", () => {
    expect(
      calculateFuelWeight({ fuelGallons: 10, poundsPerGallon: 6.7 }).weightLb,
    ).toBe(67);
  });
});
