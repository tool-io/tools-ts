import { describe, expect, it } from "vitest";
import { chao1EstimatorExample, runChao1Estimator } from "./tool.js";

describe("Chao1 Estimator", () => {
  it("matches the canonical example", () => {
    expect(runChao1Estimator(chao1EstimatorExample.input)).toEqual({
      ok: true,
      output: chao1EstimatorExample.output,
    });
  });

  it("uses the bias-corrected form when doubletons are absent", () => {
    expect(
      runChao1Estimator({
        observedSpeciesInt: 5,
        singletonInt: 4,
        doubletonInt: 0,
      }),
    ).toEqual({ ok: true, output: { chao1Estimate: 11 } });
  });

  it("returns the observed richness without rare species", () => {
    expect(
      runChao1Estimator({
        observedSpeciesInt: 7,
        singletonInt: 0,
        doubletonInt: 0,
      }),
    ).toEqual({ ok: true, output: { chao1Estimate: 7 } });
  });

  it("adds a half-step correction for one singleton and one doubleton", () => {
    expect(
      runChao1Estimator({
        observedSpeciesInt: 4,
        singletonInt: 1,
        doubletonInt: 1,
      }),
    ).toEqual({ ok: true, output: { chao1Estimate: 4.5 } });
  });

  it("scales with the number of doubletons", () => {
    expect(
      runChao1Estimator({
        observedSpeciesInt: 10,
        singletonInt: 3,
        doubletonInt: 3,
      }),
    ).toEqual({ ok: true, output: { chao1Estimate: 11.5 } });
  });

  it("rejects an empty observation", () => {
    const result = runChao1Estimator({
      observedSpeciesInt: 0,
      singletonInt: 1,
      doubletonInt: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "observedSpeciesInt",
      });
  });

  it("rejects negative counts through the schema", () => {
    expect(
      runChao1Estimator({
        observedSpeciesInt: 5,
        singletonInt: -1,
        doubletonInt: 2,
      }).ok,
    ).toBe(false);
    expect(
      runChao1Estimator({
        observedSpeciesInt: 5,
        singletonInt: 2,
        doubletonInt: -2,
      }).ok,
    ).toBe(false);
  });

  it("rejects fractional counts through the schema", () => {
    expect(
      runChao1Estimator({
        observedSpeciesInt: 5.5,
        singletonInt: 2,
        doubletonInt: 2,
      }).ok,
    ).toBe(false);
    expect(
      runChao1Estimator({
        observedSpeciesInt: 5,
        singletonInt: 1.5,
        doubletonInt: 2,
      }).ok,
    ).toBe(false);
  });
});
