import { describe, expect, it } from "vitest";
import { runA260A280Ratio } from "./tool.js";

describe("260/280 Ratio", () => {
  it("calculates a valid result", () =>
    expect(runA260A280Ratio({ absorbance260: 1.8, absorbance280: 1 })).toEqual({
      ok: true,
      output: { purityRatio: 1.8 },
    }));
  it("returns two for pure DNA-like absorbance", () =>
    expect(runA260A280Ratio({ absorbance260: 2, absorbance280: 1 })).toEqual({
      ok: true,
      output: { purityRatio: 2 },
    }));
  it("returns zero without nucleic acid signal", () =>
    expect(runA260A280Ratio({ absorbance260: 0, absorbance280: 1 })).toEqual({
      ok: true,
      output: { purityRatio: 0 },
    }));
  it("rejects negative A260", () =>
    expect(runA260A280Ratio({ absorbance260: -1, absorbance280: 1 }).ok).toBe(
      false,
    ));
  it("rejects a zero denominator", () =>
    expect(runA260A280Ratio({ absorbance260: 1, absorbance280: 0 }).ok).toBe(
      false,
    ));
});
