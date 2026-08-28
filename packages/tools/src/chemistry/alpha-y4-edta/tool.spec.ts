import { describe, expect, it } from "vitest";
import { runAlphaY4Edta } from "./tool.js";
describe("EDTA Alpha Y4 Fraction", () => {
  it("calculates a valid result", () =>
    expect(runAlphaY4Edta({ ph: 10 })).toEqual({
      ok: true,
      output: { alphaY4: 0.3546144704794824 },
    }));
  it("rejects pKa values in the wrong order", () =>
    expect(runAlphaY4Edta({ ph: 10, pka1: 3, pka2: 2 }).ok).toBe(false));
});
