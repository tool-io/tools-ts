import { describe, expect, it } from "vitest";
import {
  ergosterolBiomassMarkerCalculatorExample,
  runErgosterolBiomassMarkerCalculator,
} from "./tool.js";

describe("Ergosterol Biomass", () => {
  it("matches the canonical example", () =>
    expect(
      runErgosterolBiomassMarkerCalculator(
        ergosterolBiomassMarkerCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: ergosterolBiomassMarkerCalculatorExample.output,
    }));
  it("maps zero ergosterol to zero biomass", () =>
    expect(
      runErgosterolBiomassMarkerCalculator({
        biomassPerErgosterolFactor: 180,
        ergosterolUgPerG: 0,
      }),
    ).toEqual({
      ok: true,
      output: { fungalBiomassUgPerG: 0 },
    }));
  it("maps one microgram per gram to one hundred eighty", () =>
    expect(
      runErgosterolBiomassMarkerCalculator({
        biomassPerErgosterolFactor: 180,
        ergosterolUgPerG: 1,
      }),
    ).toEqual({
      ok: true,
      output: { fungalBiomassUgPerG: 180 },
    }));
  it("converts fractional concentrations", () =>
    expect(
      runErgosterolBiomassMarkerCalculator({
        biomassPerErgosterolFactor: 180,
        ergosterolUgPerG: 0.5,
      }),
    ).toEqual({ ok: true, output: { fungalBiomassUgPerG: 90 } }));
  it("converts quarter steps", () =>
    expect(
      runErgosterolBiomassMarkerCalculator({
        biomassPerErgosterolFactor: 180,
        ergosterolUgPerG: 1.25,
      }),
    ).toEqual({ ok: true, output: { fungalBiomassUgPerG: 225 } }));
  it("rejects negative concentrations", () =>
    expect(
      runErgosterolBiomassMarkerCalculator({
        biomassPerErgosterolFactor: 180,
        ergosterolUgPerG: -0.1,
      }).ok,
    ).toBe(false));
  it("uses the supplied calibration factor", () =>
    expect(
      runErgosterolBiomassMarkerCalculator({
        biomassPerErgosterolFactor: 100,
        ergosterolUgPerG: 2,
      }),
    ).toEqual({ ok: true, output: { fungalBiomassUgPerG: 200 } }));
});
