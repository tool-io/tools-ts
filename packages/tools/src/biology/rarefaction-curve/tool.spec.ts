import { describe, expect, it } from "vitest";
import { rarefactionCurveExample, runRarefactionCurve } from "./tool.js";

describe("Rarefied Richness", () => {
  it("publishes an executable example", () =>
    expect(runRarefactionCurve(rarefactionCurveExample.input)).toEqual({
      ok: true,
      output: rarefactionCurveExample.output,
    }));
  it("returns full richness for a complete sample", () =>
    expect(
      runRarefactionCurve({
        sampleSizeInt: 120,
        speciesTotalInt: 15,
        totalIndividualsInt: 120,
      }),
    ).toEqual({ ok: true, output: { rarefiedRichness: 15 } }));
  it("halves richness at half sampling", () =>
    expect(
      runRarefactionCurve({
        sampleSizeInt: 40,
        speciesTotalInt: 12,
        totalIndividualsInt: 80,
      }),
    ).toEqual({ ok: true, output: { rarefiedRichness: 6 } }));
  it("accepts the smallest valid inputs", () =>
    expect(
      runRarefactionCurve({
        sampleSizeInt: 1,
        speciesTotalInt: 1,
        totalIndividualsInt: 1,
      }),
    ).toEqual({ ok: true, output: { rarefiedRichness: 1 } }));
  it("keeps fractional expectations", () =>
    expect(
      runRarefactionCurve({
        sampleSizeInt: 25,
        speciesTotalInt: 10,
        totalIndividualsInt: 75,
      }),
    ).toEqual({
      ok: true,
      output: { rarefiedRichness: 3.3333333333333335 },
    }));
  it("rejects oversampling", () => {
    const result = runRarefactionCurve({
      sampleSizeInt: 201,
      speciesTotalInt: 20,
      totalIndividualsInt: 200,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("oversample");
  });
  it("rejects zero species totals", () => {
    const result = runRarefactionCurve({
      sampleSizeInt: 10,
      speciesTotalInt: 0,
      totalIndividualsInt: 100,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects zero sample sizes", () => {
    const result = runRarefactionCurve({
      sampleSizeInt: 0,
      speciesTotalInt: 20,
      totalIndividualsInt: 100,
    });
    expect(result.ok).toBe(false);
  });
});
