import { describe, expect, it } from "vitest";
import { jackknifeRichnessExample, runJackknifeRichness } from "./tool.js";

describe("First Order Jackknife", () => {
  it("matches the canonical example", () => {
    expect(runJackknifeRichness(jackknifeRichnessExample.input)).toEqual({
      ok: true,
      output: jackknifeRichnessExample.output,
    });
  });

  it("returns the observed richness without uniques", () => {
    expect(
      runJackknifeRichness({
        observedSpeciesInt: 12,
        sampleCountInt: 3,
        uniquesInt: 0,
      }),
    ).toEqual({ ok: true, output: { jackknifeEstimate: 12 } });
  });

  it("drops the correction entirely for a single sample", () => {
    expect(
      runJackknifeRichness({
        observedSpeciesInt: 10,
        sampleCountInt: 1,
        uniquesInt: 3,
      }),
    ).toEqual({ ok: true, output: { jackknifeEstimate: 10 } });
  });

  it("damps each unique as samples accumulate", () => {
    expect(
      runJackknifeRichness({
        observedSpeciesInt: 20,
        sampleCountInt: 4,
        uniquesInt: 2,
      }),
    ).toEqual({ ok: true, output: { jackknifeEstimate: 21.5 } });
  });

  it("accepts a zero observation", () => {
    expect(
      runJackknifeRichness({
        observedSpeciesInt: 0,
        sampleCountInt: 2,
        uniquesInt: 0,
      }),
    ).toEqual({ ok: true, output: { jackknifeEstimate: 0 } });
  });

  it("rejects an empty survey through the schema", () => {
    const result = runJackknifeRichness({
      observedSpeciesInt: 5,
      sampleCountInt: 0,
      uniquesInt: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "sampleCountInt",
      });
  });

  it("rejects negative counts through the schema", () => {
    expect(
      runJackknifeRichness({
        observedSpeciesInt: -1,
        sampleCountInt: 3,
        uniquesInt: 1,
      }).ok,
    ).toBe(false);
    expect(
      runJackknifeRichness({
        observedSpeciesInt: 5,
        sampleCountInt: 3,
        uniquesInt: -1,
      }).ok,
    ).toBe(false);
  });

  it("rejects fractional counts through the schema", () => {
    expect(
      runJackknifeRichness({
        observedSpeciesInt: 5.5,
        sampleCountInt: 3,
        uniquesInt: 1,
      }).ok,
    ).toBe(false);
    expect(
      runJackknifeRichness({
        observedSpeciesInt: 5,
        sampleCountInt: 3,
        uniquesInt: 0.5,
      }).ok,
    ).toBe(false);
  });
  it("rejects more uniques than observed species", () =>
    expect(
      runJackknifeRichness({
        observedSpeciesInt: 3,
        sampleCountInt: 4,
        uniquesInt: 4,
      }).ok,
    ).toBe(false));
});
