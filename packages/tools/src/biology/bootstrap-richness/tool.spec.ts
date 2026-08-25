import { describe, expect, it } from "vitest";
import { bootstrapRichnessExample, runBootstrapRichness } from "./tool.js";

describe("Bootstrap Richness", () => {
  it("matches the canonical example", () => {
    expect(runBootstrapRichness(bootstrapRichnessExample.input)).toEqual({
      ok: true,
      output: bootstrapRichnessExample.output,
    });
  });

  it("returns the observed richness without singletons", () => {
    expect(
      runBootstrapRichness({
        observedSpeciesInt: 14,
        sampleCountInt: 3,
        singletonInt: 0,
      }),
    ).toEqual({ ok: true, output: { bootstrapEstimate: 14 } });
  });

  it("adds the full singleton count for a single sample", () => {
    expect(
      runBootstrapRichness({
        observedSpeciesInt: 8,
        sampleCountInt: 1,
        singletonInt: 3,
      }),
    ).toEqual({ ok: true, output: { bootstrapEstimate: 11 } });
  });

  it("damps the correction as samples accumulate", () => {
    expect(
      runBootstrapRichness({
        observedSpeciesInt: 30,
        sampleCountInt: 8,
        singletonInt: 4,
      }),
    ).toEqual({ ok: true, output: { bootstrapEstimate: 30.5 } });
  });

  it("accepts a zero observation", () => {
    expect(
      runBootstrapRichness({
        observedSpeciesInt: 0,
        sampleCountInt: 2,
        singletonInt: 1,
      }),
    ).toEqual({ ok: true, output: { bootstrapEstimate: 0.5 } });
  });

  it("rejects an empty survey through the schema", () => {
    const result = runBootstrapRichness({
      observedSpeciesInt: 5,
      sampleCountInt: 0,
      singletonInt: 2,
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
      runBootstrapRichness({
        observedSpeciesInt: -3,
        sampleCountInt: 2,
        singletonInt: 1,
      }).ok,
    ).toBe(false);
    expect(
      runBootstrapRichness({
        observedSpeciesInt: 5,
        sampleCountInt: 2,
        singletonInt: -1,
      }).ok,
    ).toBe(false);
  });

  it("rejects fractional counts through the schema", () => {
    expect(
      runBootstrapRichness({
        observedSpeciesInt: 5,
        sampleCountInt: 1.5,
        singletonInt: 2,
      }).ok,
    ).toBe(false);
    expect(
      runBootstrapRichness({
        observedSpeciesInt: 5,
        sampleCountInt: 2,
        singletonInt: 2.5,
      }).ok,
    ).toBe(false);
  });
});
