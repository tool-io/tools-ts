import { describe, expect, it } from "vitest";
import { runTitrationPhBeforeEquivalence } from "./tool.js";

describe("Titration pH Before Equivalence Calculator", () => {
  it("calculates a valid result at half-equivalence", () => {
    expect(
      runTitrationPhBeforeEquivalence({
        molesAcidInitial: 2,
        molesBaseAdded: 1,
        pka: 4.76,
      }),
    ).toEqual({ ok: true, output: { ph: 4.76 } });
  });

  it("rejects invalid input", () =>
    expect(runTitrationPhBeforeEquivalence(null).ok).toBe(false));
});
