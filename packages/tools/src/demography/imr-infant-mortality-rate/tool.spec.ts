import { describe, expect, it } from "vitest";
import {
  calculateImrInfantMortalityRate,
  runImrInfantMortalityRate,
  imrInfantMortalityRateExample,
} from "./tool.js";

describe("demography/imr-infant-mortality-rate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runImrInfantMortalityRate(imrInfantMortalityRateExample.input),
    ).toEqual({
      ok: true,
      output: imrInfantMortalityRateExample.output,
    });
  });

  it("yields zero for no deaths and scales with births", () => {
    expect(
      calculateImrInfantMortalityRate({ deathsUnderOne: 0, liveBirths: 1000 }),
    ).toEqual({
      infantMortalityRate: 0,
    });
    expect(
      calculateImrInfantMortalityRate({ deathsUnderOne: 50, liveBirths: 1000 })
        .infantMortalityRate,
    ).toBe(50);
  });

  it("rejects non-positive births or negative deaths", () => {
    expect(
      runImrInfantMortalityRate({ deathsUnderOne: 5, liveBirths: 0 }).ok,
    ).toBe(false);
    expect(
      runImrInfantMortalityRate({ deathsUnderOne: -5, liveBirths: 1000 }).ok,
    ).toBe(false);
  });
});
