import { describe, expect, it } from "vitest";
import { chao2EstimatorExample, runChao2Estimator } from "./tool.js";

describe("Chao2 Estimator", () => {
  it("matches the canonical example", () => {
    expect(runChao2Estimator(chao2EstimatorExample.input)).toEqual({
      ok: true,
      output: chao2EstimatorExample.output,
    });
  });

  it("uses the bias-corrected form when doubletons are absent", () => {
    expect(
      runChao2Estimator({
        observedSpeciesInt: 6,
        sampleCountInt: 4,
        uniquesInt: 4,
        doubletonsInt: 0,
      }),
    ).toEqual({ ok: true, output: { chao2Estimate: 10.5 } });
  });

  it("returns the observed richness without unique species", () => {
    expect(
      runChao2Estimator({
        observedSpeciesInt: 9,
        sampleCountInt: 3,
        uniquesInt: 0,
        doubletonsInt: 0,
      }),
    ).toEqual({ ok: true, output: { chao2Estimate: 9 } });
  });

  it("damps the correction as the sample count grows", () => {
    expect(
      runChao2Estimator({
        observedSpeciesInt: 20,
        sampleCountInt: 10,
        uniquesInt: 4,
        doubletonsInt: 4,
      }),
    ).toEqual({ ok: true, output: { chao2Estimate: 21.8 } });
  });

  it("handles a single unique species without inflating the estimate", () => {
    expect(
      runChao2Estimator({
        observedSpeciesInt: 12,
        sampleCountInt: 4,
        uniquesInt: 1,
        doubletonsInt: 2,
      }),
    ).toEqual({ ok: true, output: { chao2Estimate: 12.1875 } });
  });

  it("rejects a single sample through the schema", () => {
    const result = runChao2Estimator({
      observedSpeciesInt: 5,
      sampleCountInt: 1,
      uniquesInt: 2,
      doubletonsInt: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "sampleCountInt",
      });
  });

  it("rejects an empty observation through the schema", () => {
    expect(
      runChao2Estimator({
        observedSpeciesInt: 0,
        sampleCountInt: 3,
        uniquesInt: 1,
        doubletonsInt: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative and fractional counts through the schema", () => {
    expect(
      runChao2Estimator({
        observedSpeciesInt: 5,
        sampleCountInt: 3,
        uniquesInt: -1,
        doubletonsInt: 2,
      }).ok,
    ).toBe(false);
    expect(
      runChao2Estimator({
        observedSpeciesInt: 5,
        sampleCountInt: 2.5,
        uniquesInt: 1,
        doubletonsInt: 2,
      }).ok,
    ).toBe(false);
  });
});
