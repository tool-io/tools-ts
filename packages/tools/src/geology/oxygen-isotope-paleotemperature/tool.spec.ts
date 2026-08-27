import { describe, expect, it } from "vitest";
import {
  calculateOxygenIsotopePaleotemperature,
  oxygenIsotopePaleotemperatureExample,
  runOxygenIsotopePaleotemperature,
} from "./tool.js";

describe("oxygen-isotope-paleotemperature", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOxygenIsotopePaleotemperature(
        oxygenIsotopePaleotemperatureExample.input,
      ),
    ).toEqual({
      ok: true,
      output: oxygenIsotopePaleotemperatureExample.output,
    });
  });

  it("returns the reference temperature for identical deltas", () => {
    const result = calculateOxygenIsotopePaleotemperature({
      calciteDelta18OPerMil: 0,
      waterDelta18OPerMil: 0,
    });
    expect(result.temperatureC).toBe(16.9);
  });

  it("warms as the calcite-water difference drops", () => {
    const result = calculateOxygenIsotopePaleotemperature({
      calciteDelta18OPerMil: -3,
      waterDelta18OPerMil: 0,
    });
    expect(result.temperatureC).toBeCloseTo(30.67, 9);
  });
});
