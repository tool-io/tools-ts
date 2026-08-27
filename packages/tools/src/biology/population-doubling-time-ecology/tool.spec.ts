import { describe, expect, it } from "vitest";
import {
  populationDoublingTimeEcologyExample,
  runPopulationDoublingTimeEcology,
} from "./tool.js";

describe("Ecological Doubling Time", () => {
  it("publishes an executable example", () =>
    expect(
      runPopulationDoublingTimeEcology(
        populationDoublingTimeEcologyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: populationDoublingTimeEcologyExample.output,
    }));
  it("divides the natural log of two by the growth rate", () =>
    expect(
      runPopulationDoublingTimeEcology({ growthRatePerCapita: 0.07 }),
    ).toEqual({ ok: true, output: { doublingTime: 9.902102579427789 } }));
  it("equals ln two for a unit growth rate", () =>
    expect(
      runPopulationDoublingTimeEcology({ growthRatePerCapita: 1 }),
    ).toEqual({
      ok: true,
      output: { doublingTime: 0.6931471805599453 },
    }));
  it("rejects zero growth rate", () => {
    const result = runPopulationDoublingTimeEcology({
      growthRatePerCapita: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative growth rate", () => {
    const result = runPopulationDoublingTimeEcology({
      growthRatePerCapita: -0.05,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects non-finite growth rate", () => {
    const result = runPopulationDoublingTimeEcology({
      growthRatePerCapita: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
