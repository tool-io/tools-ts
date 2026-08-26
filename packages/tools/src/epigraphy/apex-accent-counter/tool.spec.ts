import { describe, expect, it } from "vitest";
import {
  apexAccentCounterExample,
  calculateApexAccentCounter,
  runApexAccentCounter,
} from "./tool.js";

describe("epigraphy/apex-accent-counter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runApexAccentCounter(apexAccentCounterExample.input)).toEqual({
      ok: true,
      output: apexAccentCounterExample.output,
    });
  });

  it("treats combining acute marks like precomposed accents", () => {
    expect(calculateApexAccentCounter({ text: "a\u0301vitu" })).toEqual({
      accentedVowels: 1,
      totalVowels: 3,
      accentDensity: 0.3333333333333333,
    });
  });

  it("reports zero density for vowel-free text", () => {
    expect(calculateApexAccentCounter({ text: "SPQR XX" })).toEqual({
      accentedVowels: 0,
      totalVowels: 0,
      accentDensity: 0,
    });
  });

  it("rejects blank text", () => {
    expect(runApexAccentCounter({ text: "" }).ok).toBe(false);
  });
});
