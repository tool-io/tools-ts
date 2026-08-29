import { describe, expect, it } from "vitest";
import { fuelEconomyExample, runFuelEconomy } from "./tool.js";

describe("fuel-economy converter", () => {
  it("reproduces its US mpg example", () => {
    expect(runFuelEconomy(fuelEconomyExample.input)).toEqual({
      ok: true,
      output: fuelEconomyExample.output,
    });
  });

  it("round-trips Imperial mpg through km/L", () => {
    const first = runFuelEconomy({
      fromUnit: "mpg-Imperial",
      toUnit: "km/L",
      value: 40,
    });
    if (!first.ok) throw new Error("expected conversion success");
    const second = runFuelEconomy({
      fromUnit: "km/L",
      toUnit: "mpg-Imperial",
      value: first.output.value,
    });
    expect(second.ok && second.output.value).toBeCloseTo(40, 12);
  });

  it("rejects zero because consumption units are reciprocal", () => {
    const result = runFuelEconomy({
      fromUnit: "mpg-US",
      toUnit: "L/100km",
      value: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "value_not_positive",
        field: "value",
      });
  });
});
