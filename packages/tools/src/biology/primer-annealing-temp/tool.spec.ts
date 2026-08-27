import { describe, expect, it } from "vitest";
import { runPrimerAnnealingTemp } from "./tool.js";

describe("Annealing Temp Rule", () => {
  it("calculates a valid result", () =>
    expect(runPrimerAnnealingTemp({ tmForwardC: 58, tmReverseC: 62 })).toEqual({
      ok: true,
      output: { annealingTempC: 53 },
    }));
  it("uses the lower melting temperature", () =>
    expect(runPrimerAnnealingTemp({ tmForwardC: 60, tmReverseC: 56 })).toEqual({
      ok: true,
      output: { annealingTempC: 51 },
    }));
  it("handles equal melting temperatures", () =>
    expect(runPrimerAnnealingTemp({ tmForwardC: 55, tmReverseC: 55 })).toEqual({
      ok: true,
      output: { annealingTempC: 50 },
    }));
  it("handles negative melting temperatures", () =>
    expect(runPrimerAnnealingTemp({ tmForwardC: -2, tmReverseC: 4 })).toEqual({
      ok: true,
      output: { annealingTempC: -7 },
    }));
  it("rejects non-finite input", () =>
    expect(
      runPrimerAnnealingTemp({ tmForwardC: Number.NaN, tmReverseC: 55 }).ok,
    ).toBe(false));
});
