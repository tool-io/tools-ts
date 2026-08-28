import { describe, expect, it } from "vitest";
import { runFormality } from "./tool.js";

describe("Formality Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runFormality({ formulaWeightGMol: 58.44, massG: 5.844, volumeLiters: 2 }),
    ).toEqual({ ok: true, output: { formality: 0.05 } });
  });

  it("rejects invalid input", () => expect(runFormality(null).ok).toBe(false));
});
