import { describe, expect, it } from "vitest";
import {
  geneticDriftVarianceExample,
  runGeneticDriftVariance,
} from "./tool.js";

describe("Drift Variance", () => {
  it("publishes an executable example", () =>
    expect(runGeneticDriftVariance(geneticDriftVarianceExample.input)).toEqual({
      ok: true,
      output: geneticDriftVarianceExample.output,
    }));
  it("divides p times one minus p by twice Ne", () =>
    expect(
      runGeneticDriftVariance({
        alleleFrequencyP: 0.2,
        effectivePopulationSizeInt: 50,
      }),
    ).toEqual({ ok: true, output: { driftVariance: 0.0016000000000000003 } }));
  it("yields zero for an absent allele", () =>
    expect(
      runGeneticDriftVariance({
        alleleFrequencyP: 0,
        effectivePopulationSizeInt: 100,
      }),
    ).toEqual({ ok: true, output: { driftVariance: 0 } }));
  it("yields zero for a fixed allele", () =>
    expect(
      runGeneticDriftVariance({
        alleleFrequencyP: 1,
        effectivePopulationSizeInt: 100,
      }),
    ).toEqual({ ok: true, output: { driftVariance: 0 } }));
  it("is maximized at an intermediate frequency", () =>
    expect(
      runGeneticDriftVariance({
        alleleFrequencyP: 0.5,
        effectivePopulationSizeInt: 10,
      }),
    ).toEqual({ ok: true, output: { driftVariance: 0.0125 } }));
  it("rejects frequencies above one", () =>
    expect(
      runGeneticDriftVariance({
        alleleFrequencyP: 1.5,
        effectivePopulationSizeInt: 100,
      }).ok,
    ).toBe(false));
  it("rejects zero Ne", () =>
    expect(
      runGeneticDriftVariance({
        alleleFrequencyP: 0.5,
        effectivePopulationSizeInt: 0,
      }).ok,
    ).toBe(false));
  it("rejects missing inputs", () =>
    expect(
      runGeneticDriftVariance({ effectivePopulationSizeInt: 100 }).ok,
    ).toBe(false));
});
