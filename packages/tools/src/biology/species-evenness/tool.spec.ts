import { describe, expect, it } from "vitest";
import { runSpeciesEvenness, speciesEvennessExample } from "./tool.js";

describe("Species Evenness Pielou", () => {
  it("publishes an executable example", () =>
    expect(runSpeciesEvenness(speciesEvennessExample.input)).toEqual({
      ok: true,
      output: speciesEvennessExample.output,
    }));
  it("reports perfect evenness for maximum entropy", () =>
    expect(
      runSpeciesEvenness({ hNatural: 0.6931471805599453, speciesCount: 2 }),
    ).toEqual({ ok: true, output: { pielouEvenness: 1 } }));
  it("divides entropy by the log of the species count", () =>
    expect(
      runSpeciesEvenness({ hNatural: 1.0986122886681098, speciesCount: 3 }),
    ).toEqual({ ok: true, output: { pielouEvenness: 1.0000000000000002 } }));
  it("computes a fractional evenness", () =>
    expect(
      runSpeciesEvenness({ hNatural: 0.6931471805599453, speciesCount: 8 }),
    ).toEqual({ ok: true, output: { pielouEvenness: 0.33333333333333337 } }));
  it("rejects zero entropy as a monoculture", () => {
    const result = runSpeciesEvenness({ hNatural: 0, speciesCount: 4 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("monoculture");
  });
  it("rejects negative entropy", () => {
    const result = runSpeciesEvenness({
      hNatural: -0.5,
      speciesCount: 4,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects a single-species community", () => {
    const result = runSpeciesEvenness({
      hNatural: 0.6931471805599453,
      speciesCount: 1,
    });
    expect(result.ok).toBe(false);
  });
});
