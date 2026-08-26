import { describe, expect, it } from "vitest";
import {
  calculatePerinatalRateDefinitionLookup,
  runPerinatalRateDefinitionLookup,
  perinatalRateDefinitionLookupExample,
} from "./tool.js";

describe("demography/perinatal-rate-definition-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPerinatalRateDefinitionLookup(
        perinatalRateDefinitionLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: perinatalRateDefinitionLookupExample.output,
    });
  });

  it("uses total births including fetal deaths as denominator", () => {
    expect(
      calculatePerinatalRateDefinitionLookup({
        lateFetalDeaths: 0,
        earlyNeonatalDeaths: 50,
        liveBirths: 9950,
      }).perinatalMortalityRate,
    ).toBe(5.025125628140704);
  });

  it("rejects non-positive births or negative counts", () => {
    expect(
      runPerinatalRateDefinitionLookup({
        lateFetalDeaths: -1,
        earlyNeonatalDeaths: 0,
        liveBirths: 100,
      }).ok,
    ).toBe(false);
    expect(
      runPerinatalRateDefinitionLookup({
        lateFetalDeaths: 0,
        earlyNeonatalDeaths: 0,
        liveBirths: 0,
      }).ok,
    ).toBe(false);
  });
});
