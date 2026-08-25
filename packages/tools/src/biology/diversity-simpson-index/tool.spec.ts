import { describe, expect, it } from "vitest";
import { runDiversitySimpsonIndex } from "./tool.js";

describe("Simpson Index D", () => {
  it("calculates a valid result", () =>
    expect(
      runDiversitySimpsonIndex({
        speciesACount: 2,
        speciesBCount: 2,
        speciesCCount: 2,
      }),
    ).toEqual({ ok: true, output: { simpsonIndexD: 0.2 } }));
  it("approaches one for dominant species", () =>
    expect(
      runDiversitySimpsonIndex({
        speciesACount: 9,
        speciesBCount: 1,
        speciesCCount: 0,
      }),
    ).toEqual({ ok: true, output: { simpsonIndexD: 0.8 } }));
  it("is zero for three singletons", () =>
    expect(
      runDiversitySimpsonIndex({
        speciesACount: 1,
        speciesBCount: 1,
        speciesCCount: 1,
      }),
    ).toEqual({ ok: true, output: { simpsonIndexD: 0 } }));
  it("is one for a single species sample", () =>
    expect(
      runDiversitySimpsonIndex({
        speciesACount: 2,
        speciesBCount: 0,
        speciesCCount: 0,
      }),
    ).toEqual({ ok: true, output: { simpsonIndexD: 1 } }));
  it("handles even four-way splits across three species", () =>
    expect(
      runDiversitySimpsonIndex({
        speciesACount: 3,
        speciesBCount: 1,
        speciesCCount: 0,
      }),
    ).toEqual({ ok: true, output: { simpsonIndexD: 0.5 } }));
  it("rejects samples with fewer than two individuals", () => {
    const result = runDiversitySimpsonIndex({
      speciesACount: 1,
      speciesBCount: 0,
      speciesCCount: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("insufficient_samples");
  });
  it("rejects an empty sample", () => {
    const result = runDiversitySimpsonIndex({
      speciesACount: 0,
      speciesBCount: 0,
      speciesCCount: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("insufficient_samples");
  });
  it("rejects negative counts", () =>
    expect(
      runDiversitySimpsonIndex({
        speciesACount: -1,
        speciesBCount: 5,
        speciesCCount: 5,
      }).ok,
    ).toBe(false));
  it("rejects fractional counts", () =>
    expect(
      runDiversitySimpsonIndex({
        speciesACount: 1.5,
        speciesBCount: 5,
        speciesCCount: 5,
      }).ok,
    ).toBe(false));
});
