import { describe, expect, it } from "vitest";
import {
  runBeerLambertAbsorbance,
  beerLambertAbsorbanceExample,
} from "./tool.js";
describe("Beer-Lambert Absorbance", () => {
  it("publishes an executable example", () =>
    expect(
      runBeerLambertAbsorbance(beerLambertAbsorbanceExample.input),
    ).toEqual({
      ok: true,
      output: beerLambertAbsorbanceExample.output,
    }));
  it("doubles with a doubled path length", () =>
    expect(
      runBeerLambertAbsorbance({
        concentrationM: 0.25,
        molarAbsorptivity: 500,
        pathLengthCm: 2,
      }),
    ).toEqual({ ok: true, output: { absorbance: 250 } }));
  it("doubles with a doubled concentration", () =>
    expect(
      runBeerLambertAbsorbance({
        concentrationM: 0.5,
        molarAbsorptivity: 500,
        pathLengthCm: 1,
      }),
    ).toEqual({ ok: true, output: { absorbance: 250 } }));
  it("allows absorbance values beyond one", () => {
    const result = runBeerLambertAbsorbance({
      concentrationM: 0.01,
      molarAbsorptivity: 50000,
      pathLengthCm: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.absorbance).toBe(500);
  });
  it("rejects zero molar absorptivity", () =>
    expect(
      runBeerLambertAbsorbance({
        concentrationM: 0.25,
        molarAbsorptivity: 0,
        pathLengthCm: 1,
      }).ok,
    ).toBe(false));
  it("rejects zero concentration", () =>
    expect(
      runBeerLambertAbsorbance({
        concentrationM: 0,
        molarAbsorptivity: 500,
        pathLengthCm: 1,
      }).ok,
    ).toBe(false));
  it("rejects negative path length", () =>
    expect(
      runBeerLambertAbsorbance({
        concentrationM: 0.25,
        molarAbsorptivity: 500,
        pathLengthCm: -1,
      }).ok,
    ).toBe(false));
});
