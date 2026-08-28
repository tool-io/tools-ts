import { describe, expect, it } from "vitest";
import { runMassFractionPpm } from "./tool.js";

describe("Mass Fraction to PPM Converter", () => {
  it("calculates a valid result", () => {
    expect(runMassFractionPpm({ massFraction: 0.00025 })).toEqual({
      ok: true,
      output: { ppm: 250 },
    });
  });

  it("rejects invalid input", () =>
    expect(runMassFractionPpm(null).ok).toBe(false));
});
