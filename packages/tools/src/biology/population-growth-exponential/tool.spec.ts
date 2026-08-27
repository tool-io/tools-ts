import { describe, expect, it } from "vitest";
import {
  populationGrowthExponentialExample,
  runPopulationGrowthExponential,
} from "./tool.js";

describe("Exponential Growth", () => {
  it("publishes an executable example", () =>
    expect(
      runPopulationGrowthExponential(populationGrowthExponentialExample.input),
    ).toEqual({
      ok: true,
      output: populationGrowthExponentialExample.output,
    }));
  it("keeps the population flat at zero growth", () =>
    expect(
      runPopulationGrowthExponential({
        growthRatePerCapita: 0,
        initialPop: 1000,
        timeUnits: 5,
      }),
    ).toEqual({ ok: true, output: { projectedPopulation: 1000 } }));
  it("keeps the initial population at zero time", () =>
    expect(
      runPopulationGrowthExponential({
        growthRatePerCapita: 0.02,
        initialPop: 500,
        timeUnits: 0,
      }),
    ).toEqual({ ok: true, output: { projectedPopulation: 500 } }));
  it("rejects zero initial population", () => {
    const result = runPopulationGrowthExponential({
      growthRatePerCapita: 0.05,
      initialPop: 0,
      timeUnits: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative time", () => {
    const result = runPopulationGrowthExponential({
      growthRatePerCapita: 0.05,
      initialPop: 100,
      timeUnits: -1,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects missing inputs", () => {
    const result = runPopulationGrowthExponential({
      growthRatePerCapita: 0.05,
      timeUnits: 10,
    });
    expect(result.ok).toBe(false);
  });
});
