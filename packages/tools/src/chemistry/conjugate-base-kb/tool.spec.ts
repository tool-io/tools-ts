import { describe, expect, it } from "vitest";
import { runConjugateBaseKb } from "./tool.js";
describe("Conjugate Base Kb", () => {
  it("calculates a valid result", () =>
    expect(runConjugateBaseKb({ conjugateAcidKa: 1.8e-5 })).toEqual({
      ok: true,
      output: { conjugateBaseKb: 5.555555555555555e-10 },
    }));
  it("rejects invalid input", () =>
    expect(runConjugateBaseKb({ conjugateAcidKa: -1.8e-5 }).ok).toBe(false));
});
