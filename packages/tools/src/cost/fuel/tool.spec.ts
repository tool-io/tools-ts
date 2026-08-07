import { describe, expect, it } from "vitest";
import { fuelCostExample, runFuelCost } from "./tool.js";
describe("fuel cost", () => {
  it("publishes an executable example", () =>
    expect(runFuelCost(fuelCostExample.input)).toEqual({
      ok: true,
      output: fuelCostExample.output,
    }));
});
