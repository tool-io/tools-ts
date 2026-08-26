import { describe, expect, it } from "vitest";
import { genotypeCountExample, runGenotypeCount } from "./tool.js";

describe("Genotype Count Check", () => {
  it("matches the canonical example", () => {
    expect(runGenotypeCount(genotypeCountExample.input)).toEqual({
      ok: true,
      output: genotypeCountExample.output,
    });
  });
  it("sums three genotype classes", () =>
    expect(
      runGenotypeCount({
        aaIndividuals: 5,
        abIndividuals: 10,
        bbIndividuals: 15,
      }),
    ).toEqual({ ok: true, output: { totalCount: 30 } }));
  it("accepts all-zero counts without a total", () =>
    expect(
      runGenotypeCount({
        aaIndividuals: 0,
        abIndividuals: 0,
        bbIndividuals: 0,
      }),
    ).toEqual({ ok: true, output: { totalCount: 0 } }));
  it("passes when optional total matches", () =>
    expect(
      runGenotypeCount({
        aaIndividuals: 3,
        abIndividuals: 3,
        bbIndividuals: 4,
        optionalTotal: 10,
      }),
    ).toEqual({ ok: true, output: { totalCount: 10 } }));
  it("errors with count_mismatch on disagreement", () => {
    const result = runGenotypeCount({
      aaIndividuals: 1,
      abIndividuals: 2,
      bbIndividuals: 3,
      optionalTotal: 7,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("count_mismatch");
  });
  it("rejects negative genotype counts", () =>
    expect(
      runGenotypeCount({
        aaIndividuals: -1,
        abIndividuals: 0,
        bbIndividuals: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative optional totals", () =>
    expect(
      runGenotypeCount({
        aaIndividuals: 1,
        abIndividuals: 1,
        bbIndividuals: 1,
        optionalTotal: -5,
      }).ok,
    ).toBe(false));
});
