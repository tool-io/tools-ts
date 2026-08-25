import { describe, expect, it } from "vitest";
import { aceEstimatorExample, runAceEstimator } from "./tool.js";

describe("ACE Proxy Estimator", () => {
  it("matches the canonical example", () => {
    expect(runAceEstimator(aceEstimatorExample.input)).toEqual({
      ok: true,
      output: aceEstimatorExample.output,
    });
  });

  it("substitutes one for missing doubletons", () => {
    expect(
      runAceEstimator({
        observedSpeciesInt: 6,
        singletonInt: 4,
        doubletonInt: 0,
      }),
    ).toEqual({ ok: true, output: { aceEstimate: 14 } });
  });

  it("returns the observed richness without singletons", () => {
    expect(
      runAceEstimator({
        observedSpeciesInt: 9,
        singletonInt: 0,
        doubletonInt: 5,
      }),
    ).toEqual({ ok: true, output: { aceEstimate: 9 } });
  });

  it("adds a half-step correction for one singleton and one doubleton", () => {
    expect(
      runAceEstimator({
        observedSpeciesInt: 4,
        singletonInt: 1,
        doubletonInt: 1,
      }),
    ).toEqual({ ok: true, output: { aceEstimate: 4.5 } });
  });

  it("keeps the estimate above observed richness when rare species exist", () => {
    const result = runAceEstimator({
      observedSpeciesInt: 15,
      singletonInt: 5,
      doubletonInt: 2,
    });
    expect(result).toEqual({
      ok: true,
      output: { aceEstimate: 21.25 },
    });
  });

  it("rejects an empty observation through the schema", () => {
    const result = runAceEstimator({
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
      runAceEstimator({
        observedSpeciesInt: 5,
        singletonInt: -2,
        doubletonInt: 1,
      }).ok,
    ).toBe(false);
    expect(
      runAceEstimator({
        observedSpeciesInt: 5,
        singletonInt: 1,
        doubletonInt: -3,
      }).ok,
    ).toBe(false);
  });

  it("rejects fractional counts through the schema", () => {
    expect(
      runAceEstimator({
        observedSpeciesInt: 5,
        singletonInt: 2.5,
        doubletonInt: 2,
      }).ok,
    ).toBe(false);
    expect(
      runAceEstimator({
        observedSpeciesInt: 5,
        singletonInt: 2,
        doubletonInt: 1.5,
      }).ok,
    ).toBe(false);
  });
});
