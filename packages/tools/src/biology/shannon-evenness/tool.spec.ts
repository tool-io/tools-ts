import { describe, expect, it } from "vitest";
import { runShannonEvenness, shannonEvennessExample } from "./tool.js";

describe("Shannon Evenness", () => {
  it("publishes an executable example", () =>
    expect(runShannonEvenness(shannonEvennessExample.input)).toEqual({
      ok: true,
      output: shannonEvennessExample.output,
    }));
  it("is one for a perfectly even community", () =>
    expect(
      runShannonEvenness({
        hNatural: 0.6931471805599453,
        speciesCountInt: 2,
      }),
    ).toEqual({ ok: true, output: { shannonEvenness: 1 } }));
  it("is zero for a zero diversity index", () =>
    expect(runShannonEvenness({ hNatural: 0, speciesCountInt: 4 })).toEqual({
      ok: true,
      output: { shannonEvenness: 0 },
    }));
  it("matches Pielou form on uneven input", () =>
    expect(
      runShannonEvenness({
        hNatural: 0.6365141682948128,
        speciesCountInt: 2,
      }),
    ).toEqual({
      ok: true,
      output: { shannonEvenness: 0.9182958340544894 },
    }));
  it("rejects a monoculture species count", () =>
    expect(runShannonEvenness({ hNatural: 0.5, speciesCountInt: 1 }).ok).toBe(
      false,
    ));
  it("rejects negative diversity", () =>
    expect(runShannonEvenness({ hNatural: -1, speciesCountInt: 3 }).ok).toBe(
      false,
    ));
  it("rejects a fractional species count", () =>
    expect(runShannonEvenness({ hNatural: 0.5, speciesCountInt: 1.5 }).ok).toBe(
      false,
    ));
});
