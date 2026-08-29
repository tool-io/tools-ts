import { describe, expect, it } from "vitest";
import { runVantHoffTemperature, vantHoffTemperatureExample } from "./tool.js";
describe("Van't Hoff Transition Temperature", () => {
  it("publishes an executable example", () =>
    expect(runVantHoffTemperature(vantHoffTemperatureExample.input)).toEqual({
      ok: true,
      output: vantHoffTemperatureExample.output,
    }));
  it("computes the melting point scale ratio for water-like values", () =>
    expect(
      runVantHoffTemperature({
        deltaHJPerMol: 6010,
        deltaSJPerMolK: 22,
      }),
    ).toEqual({
      ok: true,
      output: { transitionTemperatureKelvin: 273.1818181818182 },
    }));
  it("rejects a zero entropy change", () =>
    expect(
      runVantHoffTemperature({ deltaHJPerMol: 50000, deltaSJPerMolK: 0 }).ok,
    ).toBe(false));
  it("reports inconsistent_units for opposite signs", () => {
    const result = runVantHoffTemperature({
      deltaHJPerMol: -50000,
      deltaSJPerMolK: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("inconsistent_units");
  });
});
