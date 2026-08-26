import { describe, expect, it } from "vitest";
import {
  calculateNeonatalPostneonatalSplitLookup,
  runNeonatalPostneonatalSplitLookup,
  neonatalPostneonatalSplitLookupExample,
} from "./tool.js";

describe("demography/neonatal-postneonatal-split-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNeonatalPostneonatalSplitLookup(
        neonatalPostneonatalSplitLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: neonatalPostneonatalSplitLookupExample.output,
    });
  });

  it("handles a zero-death year without dividing by zero", () => {
    expect(
      calculateNeonatalPostneonatalSplitLookup({
        infantDeaths: 0,
        neonatalDeaths: 0,
        liveBirths: 50000,
      }),
    ).toEqual({
      neonatalRate: 0,
      postneonatalRate: 0,
      neonatalSharePercent: 0,
    });
  });

  it("rejects inconsistent death counts or births", () => {
    expect(
      runNeonatalPostneonatalSplitLookup({
        infantDeaths: 10,
        neonatalDeaths: 11,
        liveBirths: 1000,
      }).ok,
    ).toBe(false);
    expect(
      runNeonatalPostneonatalSplitLookup({
        infantDeaths: 10,
        neonatalDeaths: 5,
        liveBirths: 0,
      }).ok,
    ).toBe(false);
  });
});
