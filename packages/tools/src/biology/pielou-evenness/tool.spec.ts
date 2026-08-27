import { describe, expect, it } from "vitest";
import { pielouEvennessExample, runPielouEvenness } from "./tool.js";

describe("Pielou Evenness", () => {
  it("publishes an executable example", () =>
    expect(runPielouEvenness(pielouEvennessExample.input)).toEqual({
      ok: true,
      output: pielouEvennessExample.output,
    }));
  it("is one for a perfectly even two-species community", () =>
    expect(
      runPielouEvenness({
        hNatural: 0.6931471805599453,
        speciesCountInt: 2,
      }),
    ).toEqual({ ok: true, output: { pielouEvenness: 1 } }));
  it("is zero for a monoculture index of zero", () =>
    expect(runPielouEvenness({ hNatural: 0, speciesCountInt: 5 })).toEqual({
      ok: true,
      output: { pielouEvenness: 0 },
    }));
  it("scales uneven diversity by ln(S)", () =>
    expect(runPielouEvenness({ hNatural: 0.5, speciesCountInt: 2 })).toEqual({
      ok: true,
      output: { pielouEvenness: 0.7213475204444817 },
    }));
  it("rejects a monoculture species count", () =>
    expect(runPielouEvenness({ hNatural: 0.5, speciesCountInt: 1 }).ok).toBe(
      false,
    ));
  it("rejects negative diversity", () =>
    expect(runPielouEvenness({ hNatural: -0.1, speciesCountInt: 3 }).ok).toBe(
      false,
    ));
  it("rejects a fractional species count", () =>
    expect(runPielouEvenness({ hNatural: 0.5, speciesCountInt: 2.5 }).ok).toBe(
      false,
    ));
});
