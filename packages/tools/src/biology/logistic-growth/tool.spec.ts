import { describe, expect, it } from "vitest";
import { logisticGrowthExample, runLogisticGrowth } from "./tool.js";

describe("Logistic Growth Value", () => {
  it("publishes an executable example", () =>
    expect(runLogisticGrowth(logisticGrowthExample.input)).toEqual({
      ok: true,
      output: logisticGrowthExample.output,
    }));
  it("keeps the initial population at zero time", () =>
    expect(
      runLogisticGrowth({
        capacityK: 100,
        growthRatePerCapita: 0.4,
        initialPop: 10,
        timeUnits: 0,
      }),
    ).toEqual({ ok: true, output: { population: 10 } }));
  it("pins an initial population at capacity to K", () =>
    expect(
      runLogisticGrowth({
        capacityK: 500,
        growthRatePerCapita: 0.3,
        initialPop: 500,
        timeUnits: 4,
      }),
    ).toEqual({ ok: true, output: { population: 500 } }));
  it("rejects zero carrying capacity", () => {
    const result = runLogisticGrowth({
      capacityK: 0,
      growthRatePerCapita: 0.5,
      initialPop: 100,
      timeUnits: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects zero growth rate", () => {
    const result = runLogisticGrowth({
      capacityK: 100,
      growthRatePerCapita: 0,
      initialPop: 10,
      timeUnits: 1,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative initial population", () => {
    const result = runLogisticGrowth({
      capacityK: 100,
      growthRatePerCapita: 0.5,
      initialPop: -100,
      timeUnits: 10,
    });
    expect(result.ok).toBe(false);
  });
});
