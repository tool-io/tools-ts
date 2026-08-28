import { describe, expect, it } from "vitest";
import { runConjugateAcidKa } from "./tool.js";
describe("Conjugate Acid Ka", () => {
  it("calculates a valid result", () =>
    expect(runConjugateAcidKa({ conjugateBaseKb: 1.8e-5 })).toEqual({
      ok: true,
      output: { conjugateAcidKa: 5.555555555555555e-10 },
    }));
  it("rejects invalid input", () =>
    expect(runConjugateAcidKa({ conjugateBaseKb: 0 }).ok).toBe(false));
});
